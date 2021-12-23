// import { Container } from 'typedi';
import { JsonController, Post, Body, BadRequestError, Get, Req, Res } from 'routing-controllers';
import path from 'path';

@JsonController('/api')
export class HomeController {
    public jobList: Job[] = [];
    public workFlowBuilder: IWorkFlowResolver;

    constructor() {
        // TODO: WorkFlowBuilder should be injected as a dependency
        this.workFlowBuilder = new WorkFlowBuilder();
    }

    @Post('/')
    public async test(@Body() payload: Payload): Promise<any> {
        let returnVal = 'sucess';
        // Build a queueu of known supported jobs:
        this.jobList = this.workFlowBuilder.buildJobQueue(payload);

        // iterate the job queueu and execute the jobs inside it:
        for (const job of this.jobList) {
            if (job.jobName === JobTypes.PRINT) {
                this.printMe(job.jobData);
            }
            if (job.jobName === JobTypes.CHECK_IF_FILE_EXISTS) {
                const fileExists = this.isFileExists(job.jobData);
                if (!fileExists) {
                    this.printMe('File not found');
                    returnVal = 'error';
                    break;
                }
            }
            if (job.jobName === JobTypes.SET_VARIABLE) {
                this.setVariable(job.jobData['name'], job.jobData['value']);
            }
            if (job.jobName === JobTypes.READ_FILE_INTO_VARIABLE) {
                await this.readFileIntoVar(job.jobData['filename'], job.jobData['varname']);
            }
        }

        return returnVal;
    }

    private printMe(valueToPrint: string): void {
        console.log(valueToPrint);
    }

    private setVariable(varName: string, varValue: string): void {
        // TODO: implement logic
    }

    private isFileExists(filename: string): boolean {
        const assetsFolder = 'assets';
        return true;
    }

    private async readFileIntoVar(filename: string, varName: string): Promise<void> {
        // TODO: implement logic
    }
}

export class Job {
    public jobName: JobTypes;
    public jobData: any;
}

export interface IWorkFlowResolver {
    buildJobQueue(payload: Payload): Job[];
}

export class WorkFlowBuilder implements IWorkFlowResolver {
    public buildJobQueue(obj: Payload): Job[] {
        const jobList: Job[] = [];
        Object.keys(obj).forEach((key) => {
            const job = new Job();
            switch (key) {
                case 'print':
                    job.jobName = JobTypes.PRINT;
                    job.jobData = obj[key];
                    jobList.push(job);
                    break;
                case 'set_variable':
                    job.jobName = JobTypes.SET_VARIABLE;
                    job.jobData = obj[key];
                    jobList.push(job);
                    break;
                case 'file_exists':
                    job.jobName = JobTypes.CHECK_IF_FILE_EXISTS;
                    job.jobData = obj[key];
                    jobList.push(job);
                    break;
                case 'read_file_into_variable':
                    job.jobName = JobTypes.READ_FILE_INTO_VARIABLE;
                    job.jobData = obj[key];
                    jobList.push(job);
                    break;
                default:
                    break;
            }
        });

        return jobList;
    }
}

export type Payload = {
    start: string;
    print: string;
    set_variable: VariableSetter;
    file_exists: string;
    read_file_into_variable: VariableSetterFile;
    end: string;
};

export type VariableSetter = {
    name: string;
    value: string;
};

export type VariableSetterFile = {
    filename: string;
    varname: string;
};

export enum JobTypes {
    PRINT,
    CHECK_IF_FILE_EXISTS,
    READ_FILE_INTO_VARIABLE,
    SET_VARIABLE,
}
