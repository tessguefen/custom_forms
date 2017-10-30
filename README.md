# Notes.


So, instead of one single table for values, you're going to have 3. sNN_TGCD_Groups, sNN_TGCD_GroupXField, and sNN_TGCD_Values. When you insert a new "value", you'll generate the group_id, same as now, but instead of just inserting it into the Values record, you'll insert into the Groups table (once), then for however many fields you have, you'll insert into GroupXField the group_id and the field_id. (so... group:3, field_id:human.id|cats.id|etc). Your final table Values will remain the same as it is, with links to group and field (actually.... I don't think Values would even need an id column... but you can leave it in there just in case). Then...
When you are loading the values for the values list/report/whathaveyou, you would load in all possible "fields" for the form, then iterate over each field and generate an "entry". Each entry would then be appended to the SQL building, like so: tablexxx_1 and tablexxx_2 are each entries, fyi

```sql
SELECT
g.group_id AS group_id,
v_1.id AS id_1,
v_1.field_id AS field_id_1,
v_1.value AS value_1,
v_2.id AS id_2,
v_2.field_id AS field_id_2,
v_2.value AS value_2
FROM
s01_TGCD_Groups g
LEFT OUTER JOIN s01_TGCD_GroupXField gxf_1 ON g.group_id = gxf_1.group_id AND gxf_1.field_id = 1
LEFT OUTER JOIN s01_TGCD_Values v_1 ON v_1.group_id = g.group_id AND v_1.field_id = gxf_1.field_id
LEFT OUTER JOIN s01_TGCD_GroupXField gxf_2 ON g.group_id = gxf_2.group_id AND gxf_2.field_id = 2
LEFT OUTER JOIN s01_TGCD_Values v_2 ON v_2.group_id = g.group_id AND v_2.field_id = gxf_2.field_id
```


so gfx_1.field_id = 1 would be entry #1's id (and you would you ? with the parameterized query, of course)



```sql
CREATE TABLE `s01_TGCD_GroupXField` (
`group_id` int(11) DEFAULT NULL,
`field_id` int(11) DEFAULT NULL,
UNIQUE KEY `s01_TGCD_ValueXGroup_1` (`group_id`,`field_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `s01_TGCD_Groups` (
`group_id` int(11) NOT NULL,
PRIMARY KEY (`group_id`),
UNIQUE KEY `s01_TGCD_Groups_1` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
```
