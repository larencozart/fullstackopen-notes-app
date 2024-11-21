import axios from 'axios'
const baseUrl = '/api/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObj => {
  const request = axios.post(baseUrl, newObj)
  return request.then(response => {
    console.log(response.data);
    return response.data
  })
}

const update = (id, newObj) => {
  console.log("calling update function from notes.js service");
  axios.put(`${baseUrl}/${id}`, newObj);
  return Promise.resolve(newObj);
}

// const update = (id, newObject) => {
//   const request = axios.put(`${baseUrl}/${id}`, newObject)
//   return request.then(response => response.data)
// }

export default { getAll, create, update }