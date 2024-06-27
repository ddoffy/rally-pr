#!/usr/bin/env node

import { program } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import cp from "child_process";
import rally from "rally";
import dotenv from "dotenv";

dotenv.config();

var restApi = rally({
  //user: "userName", //required if no api key, defaults to process.env.RALLY_USERNAME
  //pass: "password", //required if no api key, defaults to process.env.RALLY_PASSWORD
  apiKey: process.env.RALLY_API_KEY, //preferred, required if no user/pass, defaults to process.env.RALLY_API_KEY
  apiVersion: "v2.0", //this is the default and may be omitted
  server: "https://rally1.rallydev.com", //this is the default and may be omitted
  requestOptions: {
    headers: {
      "X-RallyIntegrationName": "Rally-PR", //while optional, it is good practice to
      "X-RallyIntegrationVendor": "<Intergration name>", //provide this header information
      "X-RallyIntegrationVersion": "1.0",
    },
    //any additional request options (proxy options, timeouts, etc.)
  },
});

var queryUtils = rally.util.query;

function onError(error) {
  console.log("Failure!", error);
}

program
  .version("1.0.0")
  .description(
    "A simple CLI for generating PR with US number or defect number in the title."
  )
  .action(() => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "Enter the title of the PR: ",
        },
      ])
      .then((answers) => {
        cp.exec("git branch --show-current", (err, stdout, stderr) => {
          if (err) {
            console.error(err);
            return;
          }
          if (stderr) {
            console.error(stderr);
            return;
          }

          var branchName = stdout.trim();
          let cardNumber = branchName.split("/")[1];
          let type = "hierarchicalrequirement";
          if (cardNumber.startsWith("US")) {
            type = "hierarchicalrequirement";
          } else if (cardNumber.startsWith("DE")) {
            type = "defect";
          }
          restApi.query(
            {
              type: type,
              start: 1,
              limit: Infinity,
              order: "Rank",
              fetch: ["FormattedID", "Name", "ScheduleState"],
              query: queryUtils.where("FormattedID", "=", cardNumber),
            },
            function (error, result) {
              if (error) {
                onError(error);
              } else {
                console.log("Success!", result);
                let title = "";
                if (result.Results.length > 0) {
                  title = `${cardNumber} - ${result.Results[0].Name}`;

                  if (answers.title) {
                    title = `${title} - ${answers.title}`;
                  }

                  console.log(chalk.green("Title: "), title);

                  let body = `[${cardNumber}](${result.Results[0]._ref}): ${result.Results[0].Name}`;

                  cp.exec(
                    "gh pr create --title '" +
                      title +
                      "' --body '" +
                      body +
                      "'",
                    (err, stdout, stderr) => {
                      if (err) {
                        console.error(err);
                        return;
                      }
                      if (stderr) {
                        console.error(stderr);
                        return;
                      }
                      console.log(stdout);
                    }
                  );
                }
              }
            }
          );
        });
      });
  });

program.parse(process.argv);
