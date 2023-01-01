import { Link, useHistory } from 'react-router-dom';
import $ from 'jquery';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet';
import Loader from '../../Common/Loader';
import { useMsal } from '@azure/msal-react';
import { ProfileData } from "../../ProfileData";
import { callMsGraph } from "../../../graph";
function All() {
  const [items, setItems] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userscount, setusercount] = useState(0);
  const [rolescount, setRolesCount] = useState(0);
  const [counter, setCounter] = useState(0);
  const [loader, setloader] = useState(true);
  const [graphData, setGraphData] = useState(null);
  const { instance, accounts } = useMsal();
  const name = accounts[0] && accounts[0].name;
  useEffect(() => {
    if (userscount === 0) {
      fetch('https://etma-sql.herokuapp.com/api/user/GetAllUsers')
        .then((res) => res.json())
        .then(
          (result) => {
            setloader(false);
            setItems(result.data);
           
            $('.users').DataTable({
              ordering: false,
              dom: 'Bfrtip',
              buttons: [
                {
                  extend: 'pdf',
                  footer: true,
                  exportOptions: {
                    columns: [ 2, 3, 4, 5, 6, 7],
                  },
                },
                {
                  extend: 'csv',
                  footer: false,
                  exportOptions: {
                    columns: [ 2, 3, 4, 5, 6, 7],
                  },
                },
              ],
              language: {
                lengthMenu: 'MENU bản ghi trên trang',
                search: '<i className="fa fa-search"></i>',
                searchPlaceholder: 'Search',
              },
              initComplete: function (settings, json) {
                $('.dt-buttons').prepend(
                  "<h4 class='export_title'>Export Users:</h4>"
                );
                $('.dt-buttons').wrapInner("<div class='wrapElement'></div>");

                $('.dt-buttons').append(
                  `<div class="importuserscontainer">
                  <h4 class='export_title'>Import Users:</h4>
                  <a href="#/users/upload" id="importUser"  class="dt-button"   type="button">Import</a>
                  </div>`
                );
              },
            });
          },
          (error) => {}
        );
      setusercount(1);
    }
  }, [userscount]);

  useEffect(() => {
    if (rolescount === 0) {
      fetch('https://etma-sql.herokuapp.com/api/roles/GetRoles')
        .then((res) => res.json())
        .then(
          (result) => {
            setRoles(result.data);
          },
          (error) => {}
        );
      setRolesCount(1);
    }
  }, [rolescount]);

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
              window.location.reload(false);
            },
            (error) => {}
          );
      }
    });

    //}
  }

  function RequestProfileData() {
    const request = {
        account: accounts[0]
    };

    // Silently acquires an access token which is then attached to a request for Microsoft Graph data
    instance.acquireTokenSilent(request).then((response) => {

        callMsGraph(response.accessToken).then(response => {
    debugger
    setGraphData(response);
        } )
    }).catch((e) => {

        instance.acquireTokenPopup(request).then((response) => {
            callMsGraph(response.accessToken).then(response => setGraphData(response));
        });
    });
}


  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Users</title>
      </Helmet>
      <main className='manage-users-main'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-12'>
              <div className='dashboardheaderbar d-flex justify-content-between align-items-center'>
                <h1 className='dashboardtitle'>Manage Users</h1>
                <div className='btngroup'>
                  <Link to='/users/add'>
                    <button
                      type='button'
                      className='btn btn-outline-primary dashboardtitle-btn'
                    >
                      Create New User
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className='row mb-4'>
            <div className='col-12 mb-4'>
              <div className='card'>
                <div className='card-body table-inner'>
                  {loader ? (
                    <Loader />
                  ) : (
                    <table
                      className='data-table data-table-feature users'
                      id='data-table-etma'
                    >
                      <thead>
                        <tr>
                          <th>Sr. No</th>
                          <th hidden>Employee Id</th>
                          <th>User Name</th>
                          <th>Email</th>
                          <th>Department</th>
                          <th>BatchNo</th>
                          <th>Roles</th>
                          <th>Admin</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => {
                          return (
                            <tr id={item.UserId} key={item.UserId}>
                              <td>{index + 1}</td>
                              <td hidden>{item.UserId}</td>
                              <td>{item.UserName}</td>
                              <td>{item.Email}</td>
                              <td>{item.Department}</td>
                              <td>{item.BatchNo}</td>
                              <td>{item.Roles}</td>
                              <td>{item.Admin}</td>
                              <td>
                                <div className='actionbtns'>
                                  <Link
                                    to={`/users/edit/${item.UserId}`}
                                    className='listcardtable__actionbtn'
                                  >
                                    <img
                                      src='./assets/images/Edit.svg'
                                      alt='edit data table'
                                    />
                                  </Link>

                                  <button
                                    style={{
                                      padding: '0',
                                      backgroundColor: 'unset',
                                      border: 'unset',
                                    }}
                                    className='listcardtable__actionbtn'
                                    onClick={() => deleteItem(item.UserId)}
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
                  )}
                </div>
                {/* {graphData ? 
                <ProfileData graphData={graphData} />
                :
                <button variant="secondary" onClick={RequestProfileData}>Request Profile Information</button>
            } */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default All;
