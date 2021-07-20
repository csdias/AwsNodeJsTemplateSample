"use strict";

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Chupa seus vagabundos!",
        input: event,
      },
      null,
      2
    ),
  };
};
