import 'reflect-metadata';
// import path from 'path';
// import { useContainer } from 'routing-controllers';
// import { Container } from 'typedi';
import express from 'express';
import { useExpressServer } from 'routing-controllers';

export const baseDir = __dirname;

(async () => {
    // useContainer(Container);
    const app = express();
    useExpressServer(app, {
        controllers: [baseDir + '//controllers/*{.js,.ts}'],
    });

    const port: number = Number(process.env.PORT) || 3000;
    app.listen(port, () => {
        console.log(`listening on port ${port}`);
    });
})();
