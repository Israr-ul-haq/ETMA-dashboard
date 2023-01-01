import { Link, useParams, useHistory } from 'react-router-dom';
import $ from 'jquery';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { Helmet } from 'react-helmet';
import LoaderButton from '../../Common/LoaderButton';

function Edit() {
  const [error, setError] = useState(null);
  const [user, setuser] = useState([]);
  const [finaluser, setfinaluser] = useState({});
  const [departments, setdepartments] = useState([]);
  const [roles, setroles] = useState([]);
  const [rolesItems, setRolesItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [btnLock, setBtnLock] = useState(false);

  const [SelectedUserRoles, setSelectedUserRoles] = useState([]);
  const history = useHistory();
  const [adminerror, setadminerror] = useState(null);
  const [admins, setadmins] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetch(`https://etma-sql.herokuapp.com/api/roles/GetRoles`)
      .then((res) => res.json())
      .then(
        (result) => {
          setroles(result.data);
          if (user.length === 0) {
            fetch(`https://etma-sql.herokuapp.com/api/user/GetUsers/${id}`)
              .then((res) => res.json())
              .then(
                (innerResult) => {
                  let roles = innerResult.data[0].Roles.split(',');
                  let finalRoles = [];
                  let selectedRoles = [];
                  for (let i = 0; i < result.data.length; i++) {
                    for (let j = 0; j < roles.length; j++) {
                      if (result.data[i].Description === roles[j]) {
                        finalRoles.push({
                          RoleId: result.data[i].RoleId,
                          Role: result.data[i].Description,
                        });
                        selectedRoles.push({
                          value: result.data[i].RoleId,
                        });
                      }
                    }
                  }
                  setSelectedUserRoles(selectedRoles);
                  setuser(innerResult.data);
                  setRolesItems(finalRoles);
                  setIsLoaded(true);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                  setError(error);
                  setIsLoaded(true);
                }
              );
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setError(error);
        }
      );
  }, [user]);

  useEffect(() => {
    fetch(`https://etma-sql.herokuapp.com/api/departments/GetDepartments`)
      .then((res) => res.json())
      .then(
        (result) => {
          setdepartments(result.data);
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
    fetch(`https://etma-sql.herokuapp.com/api/admins/GetAdmins`)
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

  const handleSubmit = (e) => {
    e.preventDefault();
    //const employeeId = crypto.randomBytes(16).toString("hex");
    debugger;

    if (SelectedUserRoles.length === 0) {
      user.userRole = [
        {
          roleId: 1,
        },
      ];
      //return;
    } else {
      user.userRole = [];
      SelectedUserRoles.forEach((item) => {
        user.userRole.push({
          roleId: parseInt(item.value),
        });
      });
    }

    // user.admin = user.admin._id;
    // user.userId = user._id;
    // finaluser.userId = user.userId;

    finaluser.name = user[0].UserName;
    finaluser.email = user[0].Email;
    finaluser.departmentId = parseInt(user[0].DepartmentId);
    finaluser.batchNo = user[0].BatchNo;
    finaluser.userRole = user.userRole;
    finaluser.adminId = parseInt(user[0].AdminId);
    finaluser.userId = parseInt(id);
    setBtnLock(true);
    fetch('https://etma-sql.herokuapp.com/api/user/UpdateUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finaluser),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (data.code !== 1) {
          setBtnLock(false);
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
          setBtnLock(false);
          Swal.fire({
            title: 'User Updated!',
            text: '',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'ok',
            showCloseButton: false,
          });
          history.push('/users');
        }
      });
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <Helmet>
          <meta charSet='utf-8' />
          <title>Edit User</title>
        </Helmet>
        <main className='manage-users-main'>
          <div className='container-fluid'>
            <div className='row'>
              <div className='col-12'>
                <div className='dashboardheaderbar d-flex justify-content-between align-items-center'>
                  <div className='filter-user-top-bar'>
                    <Link to='/users'>
                      <h1 className='dashboardtitle create-dashboardtitle'>
                        <div className='arrow-icon-dashboardtitle'>
                          <img alt='back_image' src='/assets/images/Back.png' />
                        </div>
                        Edit User
                      </h1>
                    </Link>
                  </div>
                  {/* <div className="btngroup">
                        <Link to="#">
                            <button type="button" className="btn btn-outline-primary dashboardtitle-btn">Publish
                            </button>
                        </Link>
                    </div> */}
                </div>
              </div>
            </div>

            <div className='row'>
              <div className='col-12'>
                <div className='card mb-4'>
                  <div className='card-body'>
                    <form className='add-new' onSubmit={handleSubmit}>
                      <div className='form-2'>
                        <div className='row form-inner-row'>
                          <div className='form-group name-field col-md-4'>
                            <label htmlFor='form-label'>User Name</label>
                            <input
                              type='text'
                              className='form-control add-form-control'
                              id='InputName'
                              placeholder='Adam Hawkins'
                              required
                              value={user[0].UserName}
                              onChange={(event) => {
                                const b = { ...user };
                                b[0].UserName = event.target.value;
                                setuser(b);
                              }}
                            />
                          </div>
                          <div className='form-group col-md-4'>
                            <label
                              htmlFor='inputEmail'
                              className='col-form-label'
                            >
                              Email
                            </label>
                            <input
                              type='email'
                              className='form-control add-form-control'
                              id='inputEmail'
                              placeholder='Amber@gmail.com'
                              required
                              value={user[0].Email}
                              onChange={(event) => {
                                const b = { ...user };
                                b[0].Email = event.target.value;
                                setuser(b);
                              }}
                            />
                          </div>
                          <div className='form-group col-md-4'>
                            <label htmlFor='form-label'>Select Admin</label>
                            <select
                              id='input-select'
                              className='form-control add-form-control'
                              required
                              onChange={(event) => {
                                const b = { ...user };
                                b[0].AdminId = event.target.value;
                                setuser(b);
                                setadminerror('');
                              }}
                            >
                              {admins.length === 0 ? (
                                <option>Loading...</option>
                              ) : (
                                <>
                                  <option value=''>Select Admin</option>
                                  {admins.map((item, i) => {
                                    return (
                                      <option
                                        value={item.AdminId}
                                        key={item.AdminId}
                                        selected={
                                          user[0].AdminId === item.AdminId
                                            ? 'selected'
                                            : ''
                                        }
                                      >
                                        {item.Description}
                                      </option>
                                    );
                                  })}
                                </>
                              )}
                            </select>
                            {adminerror ? (
                              <div class='text-danger'>Required.</div>
                            ) : (
                              <div></div>
                            )}
                          </div>
                        </div>

                        <div className='row form-inner-row'>
                          <div className='form-group col-md-4'>
                            <label htmlFor='form-label'>Batch No</label>
                            <input
                              type='text'
                              className='form-control add-form-control'
                              id='inputBatchNo'
                              placeholder='02'
                              required
                              value={user[0].BatchNo}
                              onChange={(event) => {
                                const b = { ...user };
                                b[0].BatchNo = event.target.value;
                                setuser(b);
                              }}
                            />
                          </div>
                          <div className='form-group col-md-4'>
                            <label htmlFor='form-label'>Role</label>

                            <Select
                              isMulti
                              name='colors'
                              options={
                                roles.length === 0
                                  ? [
                                      {
                                        value: '',
                                        label: 'Loading...',
                                      },
                                    ]
                                  : roles.map(function (item) {
                                      return {
                                        value: item.RoleId,
                                        label: item.Description,
                                      };
                                    })
                              }
                              defaultValue={
                                rolesItems.length === 0
                                  ? [
                                      {
                                        value: '',
                                        label: 'Loading...',
                                      },
                                    ]
                                  : rolesItems.map(function (item) {
                                      return {
                                        value: item.RoleId,
                                        label: item.Role,
                                      };
                                    })
                              }
                              onChange={(option) =>
                                setSelectedUserRoles(option)
                              }
                              className='basic-multi-select'
                              classNamePrefix='select'
                            />
                          </div>
                          <div className='form-group col-md-4'>
                            <label htmlFor='form-label'>Department</label>
                            <select
                              id='input-select'
                              className='form-control add-form-control'
                              required
                              onChange={(event) => {
                                const b = { ...user };
                                b[0].DepartmentId = event.target.value;
                                setuser(b);
                              }}
                            >
                              {user[0].length === 0 ? (
                                <option>Loading...</option>
                              ) : (
                                <>
                                  <option value=''>Select Department</option>
                                  {departments.map((item) => {
                                    return (
                                      <option
                                        value={item.DepartmentId}
                                        key={item.DepartmentId}
                                        selected={
                                          user[0].DepartmentId ===
                                          item.DepartmentId
                                            ? 'selected'
                                            : ''
                                        }
                                      >
                                        {item.Description}
                                      </option>
                                    );
                                  })}
                                </>
                              )}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className='form-btns'>
                        <button
                          type='submit'
                          className='btn form-btn btn-outline-primary apply-btn mb-0'
                          disabled={btnLock}
                        >
                          Save
                          {btnLock ? (
                            <div class='btnloader'>{LoaderButton}</div>
                          ) : (
                            ''
                          )}
                        </button>
                        <Link
                          to='/users'
                          className='btn form-btn btn-primary cancel-btn mb-0'
                        >
                          Cancel
                        </Link>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }
}
export default Edit;
