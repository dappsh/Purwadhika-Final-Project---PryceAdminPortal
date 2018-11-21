import React, { Component } from 'react';
import { Grid, Row, Col, Modal, FormGroup, ControlLabel, FormControl, ProgressBar } from "react-bootstrap";
import Button from "components/CustomButton/CustomButton.jsx";
import Card from "components/Card/Card.jsx";
import ReactTable from "react-table";
import "assets/css/react-table.css";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { apiHost } from './../../config';
import NotificationSystem from 'react-notification-system';
import { style } from "variables/Variables.jsx";
import Cookies from 'js-cookie';

export default class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cellInfo: {},
      showUpdate: false,
      showAdd: false,
      productId: '',
      nama: '',
      namaUpdate: '',
      price: '',
      priceUpdate: '',
      stock: '',
      stockUpdate: '',
      description: '',
      descriptionUpdate: '',
      category: '',
      categoryUpdate: '',
      image: '',
      imageUpdate: '',
      data: null,
      _notificationSystem: null,
    }

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.getProduct = this.getProduct.bind(this);
    this.handleUploadPhoto = this.handleUploadPhoto.bind(this);
  }

  componentDidMount() {
    this.getProduct();
    this.userChecking();
  }

  userChecking = () => {
    const getCookies = Cookies.get('userAdmin'); // => { name: 'value' }
    if (!getCookies) {
      this.props.history.push('login');
    }
  }

  showNotification = (color, msg) => {
    this.setState({ _notificationSystem: this.refs.notificationSystem });
    var _notificationSystem = this.refs.notificationSystem;
    var level;
    switch (color) {
      case 1:
        level = 'success';
        break;
      case 2:
        level = 'warning';
        break;
      case 3:
        level = 'error';
        break;
      case 4:
        level = 'info';
        break;
      default:
        break;
    }
    _notificationSystem.addNotification({
      title: (<span data-notify="icon" className="pe-7s-gift"></span>),
      message: (
        <div>
          {msg}
        </div>
      ),
      level: level,
      position: "tr",
      autoDismiss: 2,
    });
  }


  handleClose(x) {
    if (x === 'update') {
      this.setState({ showUpdate: false });
    } else {
      this.setState({ showAdd: false });
    }
  }

  handleShow(x, cellInfo = {}) {
    console.log('cellInfo', cellInfo);
    if (x === 'update') {
      this.setState({
        showUpdate: true,
        cellInfo,
        imageUpdate: cellInfo.productimage,
        namaUpdate: cellInfo.productname,
        priceUpdate: cellInfo.price,
        stockUpdate: cellInfo.stock,
        descriptionUpdate: cellInfo.description,
        categoryUpdate: cellInfo.category,
        productId: cellInfo.productid
      });
    } else { 
      this.setState({ showAdd: true });
    }
  }

  handleUploadPhoto = event => {
    const file = event.target.files[0];
    var formData = new FormData();
    formData.append('upload_preset', 'pryceProduct');
    formData.append('tags', 'browser_upload');
    formData.append('file', event.target.files[0]);

    if (file && file.name) { 
      const urls = `https://api.cloudinary.com/v1_1/dappsh/upload`
      fetch(urls, {
        method: 'POST', // or 'PUT'
        body: formData, // data can be `string` or {object}!

      }).then(res => res.json())
        .then(response => {
          if (response && response.secure_url) {
            this.setState({
              image: response.secure_url
            })
            this.showNotification(1, "berhasil upload photo");
          } else {
            this.showNotification(3, "gagal upload photo");
          }
        })
        .catch(error => {
          console.error('Error:', error)
          this.showNotification(3, "gagal upload photo");
        }
        );
    }
  }

  getProduct = () => {
    fetch(`${apiHost}/product`)
      .then((response) => response.json())
      .then((res) => {
        this.setState({ data: res })
      })
      .catch(error => console.error('Error:', error));
  }

  handleAddProduct = () => {
    const url = `${apiHost}/addproduct`;
    const { nama, description, stock, price, image, category } = this.state;
    if (nama === '') {
      this.showNotification(3, "Name Product tidak boleh kosong");
    } else if (description === '') {
      this.showNotification(3, "Description tidak boleh kosong");
    } else if (stock === '') {
      this.showNotification(3, "Stock tidak boleh kosong");
    } else if (price === '') {
      this.showNotification(3, "Harga tidak boleh kosong");
    } else if (image === '') {
      this.showNotification(3, "Gambar tidak boleh kosong");
    } else {
      const data = {
        productname: nama,
        description: description,
        stock: stock,
        price: price,
        productimage: image,
        category: category
      };

      fetch(url, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
        .then((response) => {
          console.log('success add Product', response);
          this.handleClose('add');
          this.getProduct();
        })
        .catch(error => {
          alert('Error Add:', error);
          this.handleClose('add');
        }
        )
    }

  }

  handleUpdateProduct = () => {
    const { namaUpdate, descriptionUpdate, stockUpdate, priceUpdate, imageUpdate, productId, categoryUpdate } = this.state;
    const url = `${apiHost}/updateproduct/${productId}`;
    if (namaUpdate === '') {
      this.showNotification(3, "Name Product tidak boleh kosong");
    } else if (descriptionUpdate === '') {
      this.showNotification(3, "Description tidak boleh kosong");
    } else if (stockUpdate === '') {
      this.showNotification(3, "Stock tidak boleh kosong");
    } else if (priceUpdate === '') {
      this.showNotification(3, "Harga tidak boleh kosong");
    } else if (imageUpdate === '') {
      this.showNotification(3, "Gambar tidak boleh kosong");
    } else {
      const data = {
        productname: namaUpdate,
        description: descriptionUpdate,
        stock: stockUpdate,
        price: priceUpdate,
        productimage: imageUpdate,
        category: categoryUpdate
      };

      fetch(url, {
        method: 'PATCH', 
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
        .then((res) => {
          console.log('success update Product', res);
          this.handleClose('update');
          this.getProduct();
        })
        .catch(error => {
          alert('Error Update:', error);
          this.handleClose('update');
        }
        )
    }
  }

  handleDeleteProduct = () => {
    const { productid } = this.state;
    const url = `${apiHost}/deleteproduct`;
    const data = {
      productid: productid,
    };
    fetch(url, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
      .then((res) => {
        console.log('success update Product', res);
        this.getProduct();
      })
      .catch(error => console.error('Error Update:', error))
  }

  render() {
    const { cellInfo, data, uploadingImage } = this.state;
    console.log('category', this.state.categoryUpdate)
    return (
      <div className="content">
        <NotificationSystem ref="notificationSystem" style={style} />
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Product List"
                category={<Button bsStyle="success" bsSize="sm" onClick={() => this.handleShow('add')}>+ Add Product</Button>}
                ctTableFullWidth
                ctTableResponsive
                content={data &&
                  <ReactTable
                    data={data}
                    columns={[
                      {
                        Header: () => {
                          return (<div style={{ textAlign: 'left', color: 'grey' }}>No.</div>)
                        },
                        accessor: "no",
                        width: 40,
                        id: "index",
                        Cell: (original) => {
                          return (<div style={{ textAlign: 'left' }}>{original.index + 1}</div>)
                        },
                      },
                      {
                        Header: () => {
                          return (<div style={{ textAlign: 'left', color: 'grey' }}>Nama</div>)
                        },
                        accessor: "nama",
                        width: 180,
                        id: "nama",
                        Cell: (original) => {
                          return (<div style={{ textAlign: 'left' }}>{original.original.productname}</div>)
                        },
                      },
                      {
                        Header: () => {
                          return (<div style={{ textAlign: 'left', color: 'grey' }}>Gambar</div>)
                        },
                        accessor: "pict",
                        width: 180,
                        id: "pict",
                        Cell: (original) => {
                          return (<img src={original.original.productimage} alt="logo_image" style={{ height: 150, margin: '0 auto', display: 'block' }} />)
                        },
                      },
                      {
                        Header: () => {
                          return (<div style={{ textAlign: 'left', color: 'grey' }}>Deskripsi</div>)
                        },
                        accessor: "desc",
                        width: 200,
                        id: "desc",
                        Cell: (original) => {
                          return (<div style={{ textAlign: 'left' }}>{original.original.description}</div>)
                        },
                      },
                      {
                        Header: () => {
                          return (<div style={{ textAlign: 'left', color: 'grey' }}>Kategori</div>)
                        },
                        accessor: "desc",
                        width: 200,
                        id: "desc",
                        Cell: (original) => {
                          return (<div style={{ textAlign: 'left' }}>{original.original.category}</div>)
                        },
                      },
                      {
                        Header: () => {
                          return (<div style={{ textAlign: 'left', color: 'grey' }}>Harga</div>)
                        },
                        accessor: "harga",
                        width: 100,
                        id: "harga",
                        Cell: (original) => {
                          return (<div style={{ textAlign: 'left' }}>{original.original.price}</div>)
                        },
                      },
                      {
                        Header: () => {
                          return (<div style={{ textAlign: 'left', color: 'grey' }}>Stock</div>)
                        },
                        accessor: "stock",
                        width: 60,
                        id: "stock",
                        Cell: (original) => {
                          return (<div style={{ textAlign: 'left' }}>{original.original.stock}</div>)
                        },
                      },
                      {
                        Header: () => {
                          return (<div style={{ textAlign: 'left', color: 'grey' }}>Update</div>)
                        },
                        width: 90,
                        Cell: (original) => {
                          const cellInfo = original.original
                          return (
                            <div style={{ textAlign: 'center' }}>
                              <Button bsStyle="info" bsSize="sm" onClick={() => this.handleShow('update', cellInfo)}>Update</Button>
                            </div>)
                        },
                      },
                      {
                        Header: () => {
                          return (<div style={{ textAlign: 'left', color: 'grey' }}>Delete</div>)
                        },
                        width: 90,
                        Cell: (original) => {
                          return (
                            <div style={{ textAlign: 'center' }}>
                              <Button bsStyle="danger" bsSize="sm">Delete</Button>
                            </div>)
                        },
                      },
                    ]}
                    defaultPageSize={10}
                    className="-striped -highlight"
                    showPagination={true}
                  />
                }
              />

            </Col>
          </Row>
        </Grid>


        <Modal show={this.state.showUpdate} onHide={() => this.handleClose('update')}>
          <Modal.Header closeButton>
            <Modal.Title>Update Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormInputs
              ncols={["col-md-12"]}
              proprieties={[
                {
                  label: "Nama",
                  type: "text",
                  bsClass: "form-control",
                  placeholder: "Nama",
                  defaultValue: this.state.namaUpdate,
                  onChange: (e) => { this.setState({ namaUpdate: e.target.value }) }
                },
              ]}
            />

            <FormInputs
              ncols={["col-md-6"]}
              proprieties={[
                {
                  label: "Harga",
                  type: "number",
                  bsClass: "form-control",
                  defaultValue: this.state.priceUpdate,
                  onChange: (e) => { this.setState({ priceUpdate: e.target.value }) }
                }
              ]}
            />
            <FormInputs
              ncols={["col-md-4"]}
              proprieties={[
                {
                  label: "Stock",
                  type: "number",
                  bsClass: "form-control",
                  placeholder: "Stock",
                  defaultValue: this.state.stockUpdate,
                  onChange: (e) => { this.setState({ stockUpdate: e.target.value }) }
                }
              ]}
            />
            <Row>
              <Col md={4}>
                <div className="form-group">
                  <label className="control-label">Image</label>
                  <input type='file' id="imgInp" />
                </div>
              </Col>
              <Col md={8}>
                <img src={this.state.imageUpdate} alt="your image" style={{ height: 60 }} />
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <FormGroup controlId="formControlsTextarea">
                  <ControlLabel>Category</ControlLabel>
                  <FormControl
                    componentClass="select"
                    placeholder="select"
                    defaultValue={this.state.categoryUpdate}
                    onChange={(e) => { this.setState({ categoryUpdate: e.target.value }) }}>
                    <option value="cats">cats</option>
                    <option value="words">words</option>
                  </FormControl>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <FormGroup controlId="formControlsTextarea">
                  <ControlLabel>Deskripsi Produk</ControlLabel>
                  <FormControl
                    rows="3"
                    componentClass="textarea"
                    bsClass="form-control"
                    placeholder="Deskripsi Produk"
                    defaultValue={this.state.descriptionUpdate}
                    onChange={(e) => { this.setState({ descriptionUpdate: e.target.value }) }}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="warning" fill onClick={() => this.handleClose('update')}>Close</Button>
            <Button bsStyle="primary" fill onClick={() => this.handleUpdateProduct()}>Save changes</Button>
          </Modal.Footer>
        </Modal>

        {/* Modal untuk Add Product */}
        <Modal show={this.state.showAdd} onHide={() => this.handleClose('add')}>
          <Modal.Header closeButton>
            <Modal.Title>Add Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormInputs
              ncols={["col-md-6", "col-md-6"]}
              proprieties={[
                {
                  label: "Nama",
                  type: "text",
                  bsClass: "form-control",
                  placeholder: "Nama",
                  onChange: (e) => { this.setState({ nama: e.target.value }) }
                },
                {
                  label: "Harga",
                  type: "number",
                  bsClass: "form-control",
                  placeholder: "Harga",
                  onChange: (e) => { this.setState({ price: e.target.value }) }
                }
              ]}
            />

            <FormInputs
              ncols={["col-md-4"]}
              proprieties={[
                {
                  label: "Stock",
                  type: "text",
                  bsClass: "form-control",
                  placeholder: "Stock",
                  onChange: (e) => { this.setState({ stock: e.target.value }) }
                }
              ]}
            />

            <Row>
              <Col md={4}>
                <div className="form-group">
                  <label className="control-label">Image</label>
                  <input type='file' id="imgInp" />
                </div>
              </Col>
              <Col md={8}>
                {this.state.image !== '' &&
                  <img src={this.state.image} alt="your image" style={{ height: 60 }} />
                }
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <FormGroup controlId="formControlsTextarea">
                  <ControlLabel>Category</ControlLabel>
                  <FormControl
                    componentClass="select"
                    placeholder="select"
                    onChange={(e) => { this.setState({ category: e.target.value }) }}>
                    <option value="cats">cats</option>
                    <option value="words">words</option>
                  </FormControl>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <FormGroup controlId="formControlsTextarea">
                  <ControlLabel>Deskripsi Produk</ControlLabel>
                  <FormControl
                    rows="3"
                    componentClass="textarea"
                    bsClass="form-control"
                    placeholder="Deskripsi Produk"
                    onChange={(e) => { this.setState({ description: e.target.value }) }}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="warning" fill onClick={() => this.handleClose('add')}>cancel</Button>
            <Button bsStyle="primary" fill onClick={() => this.handleAddProduct()}>Add Product</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}