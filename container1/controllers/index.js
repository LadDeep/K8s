import axios from "axios";
import fs from "fs";
import csv from "csv-parser";

const volumePath = "/Deep_Pravinbhai_PV_dir";

const checkIfFileExists = ({ file }) => {
  const filePath = `${volumePath}/${file}`;

  if (!fs.existsSync(filePath)) {
    return {
      fileExists: false,
    };
  }

  return {
    fileExists: true,
  };
};

const isValidCSV = (file) => {
  const filePath = `${volumePath}/${file}`;

  return new Promise((resolve, reject) => {
    let isValidHeader = false;
    let isValid = true;

    const stream = fs
      .createReadStream(filePath)
      .pipe(csv())
      .on("headers", (headers) => {
        isValidHeader =
          headers.length === 2 &&
          headers[0] === "product" &&
          headers[1] === "amount";
      })
      .on("data", (data) => {
        if (!isValid || !isValidHeader || !checkRow(data)) {
          isValid = false;
        }
      })
      .on("error", (error) => {
        isValid = false;
        reject(error);
      })
      .on("end", () => {
        if (isValid && isValidHeader) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
  });
};

function checkRow(row) {
  const keys = Object.keys(row);
  if (keys.length !== 2) {
    return false;
  }
  const amount = Number(row.amount);

  if (isNaN(amount)) {
    return false;
  }
  return true;
}

const validateAndcalculate = async (req, res) => {
  const { file, product } = req.body;

  console.log(file, product);
  if (!file) {
    res.status(200).send({
      file: null,
      error: "Invalid JSON input.",
    });
    return;
  }

  const { fileExists } = checkIfFileExists({ file });
  if (!fileExists) {
    res.status(200).send({
      file,
      error: "File not found.",
    });
    return;
  }

  const csvValid = await isValidCSV(file);
  if (!csvValid) {
    res.status(200).send({
      file,
      error: "Input file not in CSV format.",
    });
    return;
  }

  try {
    const container2Res = await axios.post(
      "http://service/count",
      {
        file,
        product,
      }
    );

    res.json(container2Res.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const storeFile = async (req, res) => {
  const { file, data } = req.body;

  if (!file) {
    res.status(200).send({
      file,
      error: "Invalid JSON input.",
    });
    return;
  }

  const filePath = `${volumePath}/${file}`;
  try {
    const cleanData = data.replace(/[^\S\n]/g, "");
    const fd = fs.openSync(filePath, 'w');
  
    fs.writeFile(fd, cleanData, (writeErr) => {
      if (writeErr) {
        console.error(writeErr);
        res.status(200).json({ file, error: "Error while storing the file to the storage." });
        return ;
      }
  
      fs.close(fd, (closeErr) => {
        if (closeErr) {
          console.error(closeErr);
        }
  
        res.json({ file, message: "Success." });
        return;
      });
    });
  } catch (err) {
    console.error("Error opening file:", err);
  }

};

export { validateAndcalculate, storeFile };
