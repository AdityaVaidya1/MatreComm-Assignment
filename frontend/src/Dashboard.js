import React, { Component } from 'react';
import {
  Button, TextField, Dialog, DialogActions, LinearProgress,
  DialogTitle, DialogContent, Card, CardContent, CardActions
} from '@material-ui/core';
import './dashboard.css';
import { Pagination } from '@material-ui/lab';
import swal from 'sweetalert';
import { withRouter } from './utils';
const axios = require('axios');

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      openBookModal: false,
      openBookEditModal: false,
      id: '',
      name: '',
      description: '',
      category: '',
      file: '',
      fileName: '',
      page: 1,
      search: '',
      books: [],
      pages: 0,
      loading: false
    };
  }

  componentDidMount = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      this.props.navigate("/login");
    } else {
      this.setState({ token: token }, () => {
        this.getBook();
      });
    }
  }

  getBook = () => {
    this.setState({ loading: true });

    let data = `?page=${this.state.page}`;
    if (this.state.search) {
      data = `${data}&search=${this.state.search}`;
    }
    axios.get(`http://localhost:2000/get-book${data}`, {
      headers: {
        'token': this.state.token
      }
    }).then((res) => {
      this.setState({ loading: false, books: res.data.books, pages: res.data.pages });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.setState({ loading: false, books: [], pages: 0 });
    });
  }

  deleteBook = (id) => {
    axios.post('http://localhost:2000/delete-book', {
      id: id
    }, {
      headers: {
        'Content-Type': 'application/json',
        'token': this.state.token
      }
    }).then((res) => {
      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.setState({ page: 1 }, () => {
        this.pageChange(null, 1);
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
    });
  }

  pageChange = (e, page) => {
    this.setState({ page: page }, () => {
      this.getBook();
    });
  }

  logOut = () => {
    localStorage.setItem('token', null);
    this.props.navigate("/");
  }

  onChange = (e) => {
    if (e.target.files && e.target.files[0] && e.target.files[0].name) {
      this.setState({ fileName: e.target.files[0].name });
    }
    this.setState({ [e.target.name]: e.target.value });
    if (e.target.name === 'search') {
      this.setState({ page: 1 }, () => {
        this.getBook();
      });
    }
  };

  addBook = () => {
    const fileInput = document.querySelector("#fileInput");
    const file = new FormData();
    file.append('file', fileInput.files[0]);
    file.append('name', this.state.name);
    file.append('description', this.state.description);
    file.append('category', this.state.category);

    axios.post('http://localhost:2000/add-book', file, {
      headers: {
        'content-type': 'multipart/form-data',
        'token': this.state.token
      }
    }).then((res) => {
      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.handleBookClose();
      this.setState({ name: '', description: '', category: '', file: null, page: 1 }, () => {
        this.getBook();
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.handleBookClose();
    });

  }

  updateBook = () => {
    const fileInput = document.querySelector("#fileInput");
    const file = new FormData();
    file.append('id', this.state.id);
    file.append('file', fileInput.files[0]);
    file.append('name', this.state.name);
    file.append('description', this.state.description);
    file.append('category', this.state.category);

    axios.post('http://localhost:2000/update-book', file, {
      headers: {
        'content-type': 'multipart/form-data',
        'token': this.state.token
      }
    }).then((res) => {
      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.handleBookEditClose();
      this.setState({ name: '', description: '', category: '', file: null }, () => {
        this.getBook();
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.handleBookEditClose();
    });

  }

  handleBookOpen = () => {
    this.setState({
      openBookModal: true,
      id: '',
      name: '',
      description: '',
      category: '',
      fileName: ''
    });
  };

  handleBookClose = () => {
    this.setState({ openBookModal: false });
  };

  handleBookEditOpen = (data) => {
    this.setState({
      openBookEditModal: true,
      id: data._id,
      name: data.name,
      description: data.description,
      category: data.category,
      fileName: data.image
    });
  };

  handleBookEditClose = () => {
    this.setState({ openBookEditModal: false });
  };

  render() {
    return (
      <div>
        {this.state.loading && <LinearProgress size={40} />}
        <div>
          <h2 style={{ color: 'black', fontWeight: 'bold' }}>Dashboard</h2>
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            onClick={this.handleBookOpen}
            style={{
              backgroundColor: '#000fff',
              color: 'white' 
            }}
          >
            Add Book
          </Button>
          <Button
            className="button_style"
            variant="contained"
            size="small"
            onClick={this.logOut}
            style={{
              backgroundColor: 'black',
              color: 'white' 
            }}
          >
            Log Out
          </Button>
        </div>

        {/* Edit Task */}
        <Dialog
          open={this.state.openBookEditModal}
          onClose={this.handleBookClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            style: {
              padding:"2%",
              background: 'linear-gradient(135deg, rgb(0, 102, 255) 0%, rgb(0, 204, 255) 100%)',
              color: 'white',
              width:"100vw",
              borderRadius: '20px'
            }
          }}
        >
          <DialogTitle id="alert-dialog-title">Edit Book</DialogTitle>
          <DialogContent>
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="name"
              value={this.state.name}
              onChange={this.onChange}
              placeholder="Book Name"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="description"
              value={this.state.description}
              onChange={this.onChange}
              placeholder="Description"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="category"
              value={this.state.category}
              onChange={this.onChange}
              placeholder="Category"
              required
            /><br />
            <Button
              variant="contained"
              component="label"
              style={{
                backgroundColor: 'light-grey',
                color: 'black',
              }}
            > Upload
              <input
                type="file"
                accept="image/*"
                name="file"
                onChange={this.onChange}
                id="fileInput"
                hidden
              />
            </Button>&nbsp;
            {this.state.fileName}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleBookEditClose} color="primary"
            style={{
              margin:'1%',
              backgroundColor: 'black',
              color: 'white'
            }}>
              Cancel
            </Button>
            <Button
              disabled={this.state.name === '' || this.state.description === '' || this.state.category === ''}
              onClick={this.updateBook} color="primary" autoFocus
              style={{
                backgroundColor: '#000fff',
                color: 'white'
              }}>
              Edit Book
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Book */}
        <Dialog 
          open={this.state.openBookModal}
          onClose={this.handleBookClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            style: {
              padding:'2%',
              background: 'linear-gradient(135deg, rgb(0, 102, 255) 0%, rgb(0, 204, 255) 100%)',
              color: 'white',
              width:"100vw",
              borderRadius: '20px'
            }
          }}
        >
          <DialogTitle id="alert-dialog-title">Add Book</DialogTitle>
          <DialogContent>
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="name"
              value={this.state.name}
              onChange={this.onChange}
              placeholder="Book Name"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="description"
              value={this.state.description}
              onChange={this.onChange}
              placeholder="Description"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="category"
              value={this.state.category}
              onChange={this.onChange}
              placeholder="Category"
              required
            /><br />
            <Button
              variant="contained"
              component="label"
              style={{
                backgroundColor: 'light-grey',
                color: 'black',
              }}
            > Upload
              <input
                type="file"
                accept="image/*"
                name="file"
                onChange={this.onChange}
                id="fileInput"
                hidden
              />
            </Button>&nbsp;
            {this.state.fileName}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleBookClose} color="primary"
            style={{
              backgroundColor: 'black',
              color: 'white'
            }}>
              Cancel
            </Button>
            <Button
              disabled={this.state.name === '' || this.state.description === '' || this.state.category === ''}
              onClick={this.addBook} color="primary" autoFocus
              style={{
                backgroundColor: '#000fff',
                color: 'white'
              }}>
              Add Book
            </Button>
          </DialogActions>
        </Dialog>

        <br />
        <TextField
          id="standard-basic"
          type="search"
          autoComplete="off"
          name="search"
          value={this.state.search}
          onChange={this.onChange}
          placeholder="Search by Book name"
          required
        />
        <div className="card-container">
          {this.state.books.map((book) => (
            <Card key={book._id} className="book-card">
              <img src={`http://localhost:2000/${book.image}`} alt={book.name} />
              <div className="book-card-content">
                <h3>{book.name}</h3>
                <p>Description: {book.description}</p>
                <p>Category: {book.category}</p>
                <CardActions>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => this.handleBookEditOpen(book)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => this.deleteBook(book._id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </div>
            </Card>
          ))}
        </div>
        <br />
        <Pagination count={this.state.pages} page={this.state.page} onChange={this.pageChange} color="primary"/>
      </div>
    );
  }
}

export default withRouter(Dashboard);

