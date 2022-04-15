# interactive_tuition-tracker


## Requirements

- Node - `brew install node`
- Gulp - `npm install -g gulp-cli`

## Local development

#### Installation

1. `npm install` to install development tooling
2. `gulp` to open a local development server

#### To update the tool

- To rerun the numbers on Tuition Tracker, put the numbers into a CSV (labeled something along the lines of merged-data.csv) and create a directory named something like “school-data.” The directory and the csv must be in the folder along with the Python file “dump-final.py” which will do the work of converting the csv and breaking out the data into separate json files which correspond to the IPEDS UNITIDs for each campus. 

- Add an array to dump-final.py for the newest year(s) being added to the tool. Add this year or years into the object as institution["yearly_data”]. Make sure the csv files and the school data directory are specified in the py file. You can now run the py file, you’ll find the json data in the “school-data” folder you created earlier. 

- Note: Penn State was once separated into its constituent campuses, but was unified under a single entity in 2020-21. You will have to make a decision on how to handle historical data, but in the past we decided to start over with Penn State. 
