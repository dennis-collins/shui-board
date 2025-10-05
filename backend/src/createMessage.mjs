import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";

const ddc = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env.TABLE_NAME;

const res = (status, body) => ({
  statusCode: status,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  try {
    const { username, text } = JSON.parse(event.body || "{}");
    if (!username || !text)
      return res(400, { message: "username and text are required" });

    const item = {
      id: randomUUID(),
      username: String(username).trim(),
      text: String(text).trim(),
      createdAt: new Date().toISOString(),
    };

    await ddc.send(new PutCommand({ TableName: TABLE, Item: item }));
    return res(201, item);
  } catch (e) {
    return res(500, { message: "Internal error", detail: e?.message });
  }
};
