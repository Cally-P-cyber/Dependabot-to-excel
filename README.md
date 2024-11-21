  # In order to retrieve the all the Dependabot scans for an organization you will need to get a personal access toke from GitHub (Classic tokens are the simplest)
  On initialization of the program you will need to run 'npm i' in your terminal to install all the dependencies
  To run the program you need to run 'node app.mjs' terminal 
  Then just follow the prompts in your terminal
---
# For easy parsing of the data and removal of unnecessary columns you can do the following steps in excel

## Go to data tab -> Get data -> From file -> From json \n
## Go to view -> Advanced Editor -> Run the follwing trasformation query (Delete everthing but the first line)
       ,
    #"Converted to Table" = Table.FromList(Source, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    #"Expanded Column1" = Table.ExpandRecordColumn(#"Converted to Table", "Column1", {"number", "dependency", "security_advisory", "security_vulnerability", "created_at", "dismissed_at", "dismissed_by", "dismissed_reason", "dismissed_comment", "repository"}, {"Column1.number", "Column1.dependency", "Column1.security_advisory", "Column1.security_vulnerability", "Column1.created_at", "Column1.dismissed_at", "Column1.dismissed_by", "Column1.dismissed_reason", "Column1.dismissed_comment", "Column1.repository"}),
    #"Removed Columns" = Table.RemoveColumns(#"Expanded Column1",{"Column1.dependency"}),
    #"Expanded Column1.security_vulnerability1" = Table.ExpandRecordColumn(#"Removed Columns", "Column1.security_vulnerability", {"package", "severity", "vulnerable_version_range", "first_patched_version"}, {"Column1.security_vulnerability.package", "Column1.security_vulnerability.severity", "Column1.security_vulnerability.vulnerable_version_range", "Column1.security_vulnerability.first_patched_version"}),
    #"Expanded Column1.security_advisory" = Table.ExpandRecordColumn(#"Expanded Column1.security_vulnerability1", "Column1.security_advisory", {"cve_id", "summary", "description", "severity"}, {"Column1.security_advisory.cve_id", "Column1.security_advisory.summary", "Column1.security_advisory.description", "Column1.security_advisory.severity"}),
    #"Removed Columns1" = Table.RemoveColumns(#"Expanded Column1.security_advisory",{"Column1.security_vulnerability.severity"}),
    #"Expanded Column1.security_vulnerability.package" = Table.ExpandRecordColumn(#"Removed Columns1", "Column1.security_vulnerability.package", {"ecosystem", "name"}, {"Column1.security_vulnerability.package.ecosystem", "Column1.security_vulnerability.package.name"}),
    #"Expanded Column1.security_vulnerability.first_patched_version" = Table.ExpandRecordColumn(#"Expanded Column1.security_vulnerability.package", "Column1.security_vulnerability.first_patched_version", {"identifier"}, {"Column1.security_vulnerability.first_patched_version.identifier"}),
    #"Renamed Columns" = Table.RenameColumns(#"Expanded Column1.security_vulnerability.first_patched_version",{{"Column1.number", "Alerts #"}, {"Column1.security_advisory.cve_id", "CVE"}}),
    #"Removed Columns2" = Table.RemoveColumns(#"Renamed Columns",{"Column1.security_vulnerability.first_patched_version.identifier"}),
    #"Expanded Column1.repository" = Table.ExpandRecordColumn(#"Removed Columns2", "Column1.repository", {"name"}, {"Column1.repository.name"}),
    #"Renamed Columns1" = Table.RenameColumns(#"Expanded Column1.repository",{{"Column1.repository.name", "Repository Name"}, {"Column1.dismissed_comment", "Dismissal Comments"}, {"Column1.dismissed_reason", "Dissmisal Reason"}, {"Column1.dismissed_by", "Dissmissed By"}, {"Column1.dismissed_at", "DIssmissed Date"}}),
    #"Reordered Columns" = Table.ReorderColumns(#"Renamed Columns1",{"Alerts #", "CVE", "Column1.security_advisory.summary", "Column1.security_advisory.description", "Column1.security_advisory.severity", "Column1.security_vulnerability.package.name", "Column1.security_vulnerability.vulnerable_version_range", "Column1.security_vulnerability.package.ecosystem", "Repository Name", "Column1.created_at", "DIssmissed Date", "Dissmissed By", "Dissmisal Reason", "Dismissal Comments"}),
    #"Removed Columns3" = Table.RemoveColumns(#"Reordered Columns",{"Column1.security_vulnerability.package.ecosystem"}),
    #"Renamed Columns2" = Table.RenameColumns(#"Removed Columns3",{{"Column1.created_at", "Created At"}, {"Column1.security_vulnerability.vulnerable_version_range", "Vulnerable Version Range"}, {"Column1.security_vulnerability.package.name", "Package Name"}, {"Column1.security_advisory.severity", "Advisory Severity"}, {"Column1.security_advisory.description", "Advisory Description"}, {"Column1.security_advisory.summary", "Advisory Summary"}}),
    #"Reordered Columns1" = Table.ReorderColumns(#"Renamed Columns2",{"Alerts #", "Package Name", "CVE", "Advisory Summary", "Advisory Description", "Advisory Severity", "Vulnerable Version Range", "Repository Name", "Created At", "DIssmissed Date", "Dissmissed By", "Dissmisal Reason", "Dismissal Comments"}) in #"Reordered Columns1"

