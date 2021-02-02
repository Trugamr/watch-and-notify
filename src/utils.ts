import axios from 'axios'

/** Returns the page source code for a given link */
export const getPageSource = async (link: string): Promise<string> => {
  const { data } = await axios.get<string>(link)
  return data
}
