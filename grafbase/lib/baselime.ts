export async function log(
  resolver: string,
  message: any,
  additionalMessage?: string | Record<string, any>
) {
  console.log(message, additionalMessage)
  if (process.env.env !== "prod" && process.env.env !== "staging") {
    return
  }
  let url
  if (process.env.env === "staging") {
    url = `https://events.baselime.io/v1/staging-grafbase/logs/{${resolver}`
  } else {
    url = `https://events.baselime.io/v1/grafbase/logs/${resolver}`
  }

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.BASELIME_API_KEY!
    },
    body: JSON.stringify([{ message, additionalMessage }])
  }
  await fetch(url, requestOptions)
}

export async function logError(
  resolver: string,
  error: any,
  additionalMessage?: string | Record<string, any>
) {
  console.log(error, additionalMessage)
  if (process.env.env !== "prod" && process.env.env !== "staging") {
    return
  }
  let url
  if (process.env.env === "staging") {
    url = `https://events.baselime.io/v1/staging-grafbase/errors/{${resolver}`
  } else {
    url = `https://events.baselime.io/v1/grafbase/errors/${resolver}`
  }

  if (typeof error === "object") {
    error = Object.assign(
      {
        message: error.message,
        stack: error.stack
      },
      error
    )
  }

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.BASELIME_API_KEY!
    },
    body: JSON.stringify([{ error, additionalMessage }])
  }
  await fetch(url, requestOptions)
}
