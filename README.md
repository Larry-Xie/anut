# anut
Angular Unit Test Generator. Based on https://github.com/allenhwkim/ngentest

## Install & Run
```
$ npm install anut -g # to run this command anywhere
$ anut my.component.ts # write unit test to my.directive.spec.ts
$ anut my.service.ts # write unit test to my.service.spec.ts
$ anut my.pipe.ts # write unit test to my.pipe.spec.ts
$ anut my.directive.ts # write unit test to my.directive.spec.ts
```

## How It Works
1. Parse component/directive/service, then prepare the following data.
    - className
    - imports
    - input/output attributes and properties
    - mocks
    - providers for TestBed
    - list of functions to test
2. Generate unit test from prepared data with .ejs template