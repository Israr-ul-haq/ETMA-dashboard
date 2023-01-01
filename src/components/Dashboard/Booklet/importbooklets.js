import { Link, useHistory } from 'react-router-dom';
import $ from 'jquery';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet';
import { CSVReader } from 'react-papaparse';
const ImportBooklets = () => {
  const [items, setItems] = useState([]);
  const history = useHistory();
  const buttonRef = React.createRef();
  const [departments, setdepartments] = useState([]);
  const [importDisable, setImportDisable] = useState(0);
  const [error, setError] = useState(null);
  const [admins, setadmins] = useState([]);
  const [roleerror, setroleerror] = useState(null);
  const [roles, setroles] = useState([]);
  const [finaluser, setfinaluser] = useState([]);
  function deleteItem(id) {
    Swal.fire({
      title: 'Are you sure, you want to delete this User?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      showCloseButton: true,
      closeButtonHtml: '<img src="/assets/images/Iconmaterial-cancel.svg" />',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://etma-sql.herokuapp.com/api/user/DeleteUser/${id}`, {
          method: 'POST',
        })
          .then((res) => res.json())
          .then(
            (result) => {
              setItems(
                items.filter((selecteditem) => selecteditem.employeeId !== id)
              );
            },
            (error) => {}
          );
      }
    });

    //}
  }

  useEffect(() => {
    fetch(`https://etma-sql.herokuapp.com/api/admins`)
      .then((res) => res.json())
      .then(
        (result) => {
          setadmins(result.data);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setError(error);
        }
      );
  }, []);

  useEffect(() => {
    fetch(`https://etma-sql.herokuapp.com/api/roles`)
      .then((res) => res.json())
      .then(
        (result) => {
          setroles(result.data);
          setImportDisable(1);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setError(error);
        }
      );
  }, []);

  useEffect(() => {
    fetch(`https://etma-sql.herokuapp.com/api/departments`)
      .then((res) => res.json())
      .then(
        (result) => {
          setdepartments(result.data);
          setImportDisable(1);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setError(error);
        }
      );
  }, []);

  const handleAssign = (e) => {
    e.preventDefault();
    let finalRoles = [];
    finaluser.roles = [];
    items.forEach((item) => {
      item.roles.forEach((inneritem) => {
        finaluser.roles.push(inneritem._id);
      });
      finaluser.push({
        employeeId: item.employeeId,
        name: item.name,
        email: item.email,
        department: item.departments._id,
        batchNo: item.batchNo,
        roles: [],
        admin: item.admin._id,
      });
    });

    fetch('https://etma-sql.herokuapp.com/api/user/ImportUsers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finaluser),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (data.code !== 1) {
          Swal.fire({
            title: data.message,
            text: '',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'ok',
            showCloseButton: false,
          });
        } else {
          history.push('/users');
        }
      });
  };

  const handleOpenDialog = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };

  const handleOnFileLoad = (data) => {
    for (let i = 1; i < data.length; i++) {
      let newObject = {
        name: '',
        bookletType: '',
        version: '1.0.1',
        isDraft: '',
      };

      if (data[i].data[0] !== '') {
        for (let y = 0; y < data[0].data.length; y++) {
          if (data[0].data[y].trim().toLowerCase() === 'booklet id') {
            newObject.id = data[i].data[y];
          }
          if (data[0].data[y].trim().toLowerCase() === 'booklet name') {
            newObject.name = data[i].data[y];
          }
          if (data[0].data[y].trim().toLowerCase() === 'status') {
            newObject.isDraft = data[i].data[y];
          }
          if (data[0].data[y].trim().toLowerCase() === 'type') {
            newObject.version = data[i].data[y];
          }
          if (data[0].data[y].trim().toLowerCase() === 'version') {
            newObject.isDraft = data[i].data[y];
          }
        }

        setItems((oldArray) => [...oldArray, newObject]);
      }
    }
  };

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  };

  const handleOnRemoveFile = (data) => {
    console.log('---------------------------');
    console.log(data);
    console.log('---------------------------');
  };

  const handleRemoveFile = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.removeFile(e);
    }
  };

  const showNotPublishedModal = () => {};

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Upload Booklets</title>
      </Helmet>
      <main className='manage-users-main'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-12'>
              <div className='dashboardheaderbar d-flex justify-content-between align-items-center'>
                <div className='filter-user-top-bar'>
                  <Link to='/booklets'>
                    <h1 className='dashboardtitle create-dashboardtitle'>
                      <div className='arrow-icon-dashboardtitle'>
                        <img alt='backarraow' src='/assets/images/Back.png' />
                      </div>
                      Upload Booklets
                    </h1>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-12'>
              <div className='card card-create-booklet'>
                <div className='card-body table-inner'>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div class='importcontainer importcontaineruser'>
                      <CSVReader
                        ref={buttonRef}
                        onFileLoad={handleOnFileLoad}
                        onError={handleOnError}
                        noClick
                        noDrag
                        onRemoveFile={handleOnRemoveFile}
                      >
                        {({ file }) => (
                          <button
                            disabled={importDisable ? '' : 'disabled'}
                            type='button'
                            onClick={handleOpenDialog}
                            style={{
                              borderRadius: 0,
                              marginLeft: 0,
                              marginRight: 0,
                              width: '40%',
                              paddingLeft: 0,
                              paddingRight: 0,
                            }}
                          >
                            Import File
                          </button>
                        )}
                      </CSVReader>
                    </div>
                  </div>
                  <table
                    className='data-table data-table-feature users'
                    id='data-table-etma'
                  >
                    <thead>
                      <tr>
                        <th>Sr. No</th>
                        <th hidden>Booklet Id</th>
                        <th>Booket Name</th>
                        <th>Status</th>
                        <th>Type</th>
                        <th>Version</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => {
                        return (
                          <tr id={item.admin} key={item.admin}>
                            <td>{index + 1}</td>
                            <td hidden>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>{item.departments.name}</td>
                            <td>{item.batchNo}</td>
                            <td>
                              {item.roles.map((x, index, array) => {
                                //return (index === array.length -1 ? x.name : x.name
                                if (index === array.length - 1) {
                                  return x.name;
                                } else {
                                  return x.name + ', ';
                                }
                              })}
                            </td>
                            <td>{item.admin.name}</td>
                            <td>
                              <div className='actionbtns'>
                                <button
                                  style={{
                                    padding: '0',
                                    backgroundColor: 'unset',
                                    border: 'unset',
                                  }}
                                  className='listcardtable__actionbtn'
                                  onClick={() => deleteItem(item.employeeId)}
                                >
                                  <img
                                    src='/assets/images/delete.svg'
                                    alt='delete data table'
                                  />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className='form-btns'>
                <button
                  onClick={handleAssign}
                  type='submit'
                  className='btn form-btn btn-outline-primary apply-btn mb-0'
                >
                  Save
                </button>
                <Link to='/assign-booklet'>
                  <button
                    type='button'
                    className='btn form-btn btn-primary cancel-btn mb-0'
                  >
                    Cancel
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ImportBooklets;
