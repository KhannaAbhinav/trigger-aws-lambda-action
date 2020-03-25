# Trigger AWS Lambda

## Introduction
Triggers AWS Lambda if commit tags contain both #aws and #lambda


## Inputs

### Path
Specifies a path to one or more locations. Wildcards are accepted. The default location is the current directory (.).

#### Required
False
#### Default
.

### Filter
Specifies a filter to qualify the Path parameter.

#### Required
False
#### Default
.*

### Recurse
Gets the items in the specified locations and in all child items of the locations.

#### Required
False
#### Default
True

### Top
Returns Top N values. If both Top and Bottom values are provided, Top is preferred. 0 means all values.

#### Required
False
#### Default
0

### Bottom
Returns Bottom N values. If both Top and Bottom values are provided, Top is preferred. 0 means all values.

#### Required
False

#### Default
0

### OutputToConsole
prints values on console

#### Required
False
#### Default
True

## Outputs

### LeaderBoardOutput

Stores the values in Stringified json format


Please log an issue as if you find is broken.

Thanks for checking the action.
