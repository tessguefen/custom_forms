**Operator**|**Value**
:-----:|:-----:
EQ|=
GT|>
GE|>=
LT|<
LE|<=
CO|LIKE
NC|NOT LIKE
LIKE|LIKE
NOTLIKE|NOT LIKE
NE|<>

## Example
```xml
<mvt:assign name="l.temp:type" value="'AND'" />
<mvt:assign name="l.temp:code" value="'Test_1'" />
<mvt:assign name="l.temp:operator" value="'EQ'" />
<mvt:assign name="l.temp:value" value="'Option 2'" />

<mvt:assign name="l.void" value="miva_array_insert_var( l.settings:advanced_search, l.temp, -1 )" />

<mvt:assign name="l.temp:type" value="'OR'" />
<mvt:assign name="l.temp:code" value="'approved'" />
<mvt:assign name="l.temp:operator" value="'EQ'" />
<mvt:assign name="l.temp:value" value="'1'" />

<mvt:assign name="l.void" value="miva_array_insert_var( l.settings:advanced_search, l.temp, -1 )" />
```
