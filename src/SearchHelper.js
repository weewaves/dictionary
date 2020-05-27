import _ from "lodash";

export const alphabetString = "abcdefghijklmnopqrstuvwxyz";
export const subUrlCollection =
  "a1:a2:a3:b1:b2:c1:c2:c3:c4:c5:d1:d2:d3:e1:e2:f1:f2:g:h1:h2:i1:i2:i3:j:k:l1:l2:m1:m2:n:o:p1:p2:p3:p4:p5:q:r1:r2:r3:s:t1:t2:u1:u2:v:w:x:y:z";

export function isLetter(value) {
  return alphabetString.indexOf(value) !== -1;
}

export function extractWord(definition) {
  return definition
    .split("/")[0]
    .trim()
    .substring(0);
}

export function buildDataStructure() {
  var indexedData = {};
  const alphabetArray = alphabetString.split("");

  alphabetArray.forEach(i => {
    indexedData[i] = {
      completeIndexing: false
    };

    alphabetArray.forEach(item => {
      item === i && (indexedData[i][`${i}~`] = []);
      indexedData[i][`${i}${item}`] = [];
    });
  });

  return indexedData;
}

function getUrl(folder) {
  return `https://raw.githubusercontent.com/weewaves/MyDictionaryStorage/master/${folder}.txt`;
}

export async function prepareData() {
  const defAccessArr = subUrlCollection.split(":");

  return await Promise.all(
    defAccessArr.map(i => {
      return fetch(getUrl(i)).then(async res => await res.text());
    })
  ).then(res => {
    const defData = buildDataStructure();
    const hwData = buildDataStructure();
    var groupedData = {};

    defAccessArr.forEach((def, index) => {
      const key = def.charAt(0);

      if (!_.isArray(groupedData[key])) {
        groupedData[key] = res[index].split("\n\n");
      } else {
        groupedData[key] = groupedData[key].concat(res[index].split("\n\n"));
      }
    });

    alphabetString.split("").forEach(char => {
      groupedData[char].forEach(def => {
        const subStr = def.substring(1, 3);
        const defAccess = !isLetter(subStr.charAt(1))
          ? `${subStr.charAt(0)}~`
          : subStr;
        if (_.isArray(defData[char][defAccess])) {
          defData[char][defAccess].push(def);
        }

        if (_.isArray(hwData[char][defAccess])) {
          hwData[char][defAccess].push(extractWord(def));
        }
      });

      defData[char].completeIndexing = true;
    });

    return {
      defData: defData,
      hwData: hwData
    };
  });
}

export function search(dataSource, searchQuery, count = 10) {
  searchQuery = searchQuery.toLowerCase();

  if (
    !searchQuery ||
    searchQuery.trim().length < 1 ||
    !isLetter(searchQuery.charAt(0))
  ) {
    return Promise.resolve([]);
  }

  return new Promise(function(resolve) {
    var results = [];
    const defAccess =
      searchQuery.length === 1 || !isLetter(searchQuery.charAt(1))
        ? `${searchQuery.charAt(0)}~`
        : searchQuery.substring(0, 2);

    results = dataSource[searchQuery.charAt(0)][defAccess].filter(
      definition => {
        return definition.startsWith(`@${searchQuery}`);
      }
    );

    if (results.length > 10) {
      results = results.slice(0, 10);
    }

    resolve(results);
  });
}
