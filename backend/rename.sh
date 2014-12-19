cd json
for files in *.json
do
 cat "$files" | sudo aeson-pretty > ../pretty/"${files%.json}"-dev.json
done
