const df = require("durable-functions");

module.exports = df.orchestrator(function*(context){
    const output = [];

    output.push(yield context.df.callActivity("CodeSampleManager", { code: "console.log", language: "NET" }));
    output.push(yield context.df.callActivity("CodeSamplesManager"));

    return output;
});