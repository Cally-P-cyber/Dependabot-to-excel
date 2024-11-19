import { Octokit } from "octokit";
import fs from "fs";
import * as  readline from "node:readline/promises";
import {stdin as input, stdout as output} from "node:process";

const octokit = new Octokit({ });

const rl = readline.createInterface({
  input,
  output
});

async function getPaginatedData(url,pat) {
  const nextPattern = /(?<=<)([\S]*)(?=>; rel="Next")/i;
  let pagesRemaining = true;
  let data = [];

  while (pagesRemaining) {
    const response = await octokit.request(`GET ${url}`, {
      per_page: 100,
      headers: {
      "Accept": " application/vnd.github+json",
      "Authorization" : `Bearer ${pat}`,
         "X-GitHub-Api-Version": "2022-11-28"
      },
    });

    const parsedData = parseData(response.data)
    data = [...data, ...parsedData];

    const linkHeader = response.headers.link;

    pagesRemaining = linkHeader && linkHeader.includes(`rel=\"next\"`);

    if (pagesRemaining) {
      url = linkHeader.match(nextPattern)[0];
    }
  }

  return data;
}

function parseData(data) {
  // If the data is an array, return that
    if (Array.isArray(data)) {
      return data
    }

  // Some endpoints respond with 204 No Content instead of empty array
  //   when there is no data. In that case, return an empty array.
  if (!data) {
    return []
  }

  // Otherwise, the array of items that we want is in an object
  // Delete keys that don't include the array of items
  delete data.incomplete_results;
  delete data.repository_selection;
  delete data.total_count;
  // Pull out the array of items
  const namespaceKey = Object.keys(data)[0];
  data = data[namespaceKey];

  return data;
}

const org = await rl.question("Enter the organization.  ")
const pat = await rl.question("Enter your personal access token.  ")
const file = await rl.question("Enter the file you want the outputs saved to. ")


rl.close();
let data = await getPaginatedData(`/orgs/${org}/dependabot/alerts`,pat);
data = JSON.stringify(data)

fs.writeFile(file, data, (err) => {
  if (err) console.log(err);
  else {
      console.log("File written successfully");
  }
});
