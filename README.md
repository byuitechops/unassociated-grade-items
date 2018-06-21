# Child Module Title
### *Package Name*: child-module-title
### *Child Type*: <post/pre import>
### *Platform*: <online/pathway/campus/all> (Ask Zach or Daniel about this)
### *Required*: <Required/Recommended/Optional> (Ask Zach or Daniel about this)

This child module is built to be used by the Brigham Young University - Idaho D2L to Canvas Conversion Tool. It utilizes the standard `module.exports => (course, stepCallback)` signature and uses the Conversion Tool's standard logging functions. You can view extended documentation [Here](https://github.com/byuitechops/d2l-to-canvas-conversion-tool/tree/master/documentation).

## Purpose

Describe the reason why this child module exists, and its goals.

## How to Install

```
npm install my-child-module
```

## Run Requirements

List any necessary requirements, such as fields on the `course.info` object. Include if it needs to run first, last, or similar stipulations. 

## Options

If there are options that need to be set before the module runs, include them in a table, like this:

| Option | Values | Description |
|--------|--------|-------------|
|Create Lesson Folders| true/false | Determines if lesson folders should be created inside of "documents" and "media."|
|Remove Course Image| true/false | Determines if the course image will be removed. |

## Outputs

If your module adds anything to `course.info` or anywhere else on the course object, please include a description of each in a table:

| Option | Type | Location |
|--------|--------|-------------|
|Lesson Folders| Array | course.info|

## Process

Describe in steps how the module accomplishes its goals.

1. Does this thing
2. Does that thing
3. Does that other thing

## Log Categories

List the categories used in logging data in your module.

- Discussions Created
- Canvas Files Deleted
- etc.

## Requirements

These are the expectations for the child module. What does it need to do? What is the "customer" wanting from it? 