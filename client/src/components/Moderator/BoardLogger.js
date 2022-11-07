import React, { useState, useEffect } from 'react'
import UserService from '../../services/user.service'
import ReactPaginate from 'react-paginate';

const formatMethod = (method) => {
  if (method === 'GET') {
      return <button style={{ background: 'green', fontWeight: 'bold', color: 'white', padding: '5px', width: '90px', border: 'none', cursor: 'none'}}>{method}</button>
  } else if (method === 'POST') {
      return <button style={{ background: '#2185d0', fontWeight: 'bold', color: 'white', padding: '5px', width: '90px', border: 'none', cursor: 'none'}}>{method}</button>
  } else if (method === 'PUT') {
      return <button style={{ background: 'orange', fontWeight: 'bold', color: 'white', padding: '5px', width: '90px', border: 'none', cursor: 'none'}}>{method}</button>
  } else if (method === 'DELETE') {
      return <button style={{ background: '#db2828', fontWeight: 'bold', color: 'white', padding: '5px', width: '90px', border: 'none', cursor: 'none'}}>{method}</button>
  }
}

const formatStatusCode = (statusCode) => {
  if (statusCode >= 200 && statusCode <= 299) {
      return <span style={{ color: 'green', fontWeight: 'bold' }}>{statusCode}</span>
  } else if (statusCode >= 300 && statusCode <= 399) {
      return <span style={{ color: 'orange', fontWeight: 'bold' }}>{statusCode}</span>
  } else if (statusCode >= 400 && statusCode <= 499) {
      return <span style={{ color: 'red', fontWeight: 'bold' }}>{statusCode}</span>
  } else if (statusCode >= 500 && statusCode <= 599) {
      return <span style={{ color: 'darkred', fontWeight: 'bold' }}>{statusCode}</span>
  }
}

const BoardLogger = () => {
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [query, setQuery] = useState('');
  const [msg, setMsg] = useState("");

  useEffect(() => {
    retrieveUser()
  }, [page, keyword])

  const retrieveUser = () => {
    UserService.getLogger(keyword, page, limit)
      .then((response) => {
        setUsers(response.data.result);
        setPage(response.data.page);
        setPages(response.data.totalPage);
        setRows(response.data.totalRows);
      })
      .catch((e) => {
        console.log(e)
      })
  }
  const changePage = ({ selected }) => {
    setPage(selected);
    if (selected === 9) {
      setMsg(
        "Jika tidak menemukan data yang Anda cari, silahkan cari data dengan kata kunci spesifik!"
      );
    } else {
      setMsg("");
    }
  };


  const searchData = (e) => {
    e.preventDefault();
    setPage(0);
    setMsg("");
    setKeyword(query);
  };

  return (
    <div className="container mt-5">
      <div className="columns">
        <div className="input" style={{marginLeft: '0px', marginBottom: '30px'}}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by username"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: '345%' }}
            />
            <button
              style={{ marginLeft: '7px', width: '100%' }}
              className="btn btn-secondary"
              type="button"
              onClick={searchData}
            >
              Search
            </button>
          </div>
          <table className="table text-center">
        <thead>
          <tr style={{color: 'var(--heading-color)'}}>
            <th scope="col">User ID</th>
            <th scope="col">Username</th>
            <th scope="col">Method</th>
            <th scope="col">Endpoint</th>
            <th scope="col">Status</th>
            <th scope="col">Content Length</th>
            <th scope="col">Response Time</th>
            <th scope="col">Date Time</th>
          </tr>
        </thead>
        <tbody>
          {users? users.map((user, i) => (
            <tr key={i} style={{color: 'var(--heading-color)'}}>
                <td>{user.userId}</td>
                <td>{user.username}</td>
                <td>{formatMethod(user.request_method)}</td>
                <td>{user.endpoint}</td>
                <td>{formatStatusCode(user.status_code)}</td>
                <td>{user.content_length}</td>
                <td>{user.response_time}</td>
                <td>{user.createdAt}</td>
            </tr>
          )) : null}
        </tbody>
      </table>

      <p className="text-center" style={{color: 'var(--heading-color)'}}>
            Total Rows: {rows} Page: {rows ? page + 1 : 0} of {pages}
          </p>
          <p className="text-center" style={{color: 'var(--heading-color)'}}>{msg}</p>
          <nav
            className="pagination justify-content-center"
            key={rows}
            role="navigation"
            aria-label="pagination"
          >
            <ReactPaginate
              previousLabel={"< Prev"}
              nextLabel={"Next >"}
              pageCount={Math.min(10, pages)}
              onPageChange={changePage}
              containerClassName={"pagination"}
              breakClassName={'page-item'}
              breakLinkClassName={'page-link'}
              pageClassName={'page-item'}
              pageLinkClassName={'page-link'}
              previousClassName={'page-item'}
              previousLinkClassName={'page-link'}
              nextClassName={'page-item'}
              nextLinkClassName={'page-link'}
              activeClassName={'active'}
            />
          </nav>
        </div>
      </div>
  )
}

export default BoardLogger