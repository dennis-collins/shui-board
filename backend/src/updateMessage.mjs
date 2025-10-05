import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

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
    const id = event.pathParameters?.id;
    if (!id) return res(400, { message: "id path parameter required" });

    const body = JSON.parse(event.body || "{}");
    const { text } = body;
    if (!text) return res(400, { message: "text required" });

    // Checking if msg exists.
    const found = await ddc.send(
      new GetCommand({ TableName: TABLE, Key: { id } })
    );
    if (!found.Item) return res(404, { message: `Message ${id} not found` });

    // Updating text here.
    const result = await ddc.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: { id },
        UpdateExpression: "SET #t = :t",
        ExpressionAttributeNames: { "#t": "text" },
        ExpressionAttributeValues: { ":t": String(text).trim() },
        ReturnValues: "ALL_NEW",
      })
    );

    return res(200, { message: "Updated", item: result.Attributes });
  } catch (e) {
    return res(500, { message: "Internal error", detail: e?.message });
  }
};
