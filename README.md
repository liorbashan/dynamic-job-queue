# dynamic-job-queue
A nodejs api server using TypeScript, Express and routing-controllers

## payload example:

```javascript
{
    "start":null,
    "print":"lior",
    "set_variable":{
        "name":"myVarName",
        "value":"myVarVal"
    },
    "file_exists":"file.txt",
    "read_file_into_variable":{
        "filename":"file.txt",
        "varname":"test"
    },
    "end":null
}
```
