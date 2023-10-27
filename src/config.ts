declare let process: {
    env: {
      REACT_APP_NODE_ENV: string
      REACT_APP_API_URL: string
      REACT_APP_CONSUMER_KEY: string
      REACT_APP_CONSUMER_SECRET: string
    }
  }

export const config = {
    shop: {
        apiURL: process.env.REACT_APP_API_URL,
        consumer_key: process.env.REACT_APP_CONSUMER_KEY,
        consumer_secret: process.env.REACT_APP_CONSUMER_SECRET
    }
}