export const DecodeResponse = (response) => {
  return new Promise(async (resolve) => {
    const buffer = await response.arrayBuffer();
    const text = Buffer.from(buffer).toString('utf8');

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    resolve(data);
  });
};
