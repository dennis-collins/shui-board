import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

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

export const handler = async () => {
  try {
    const { Items = [] } = await ddc.send(
      new ScanCommand({ TableName: TABLE })
    );
    Items.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    return res(200, Items);
  } catch (e) {
    return res(500, { message: "Internal error", detail: e?.message });
  }
};
