import $, { event } from 'jquery';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Link, useParams, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Loader from '../../Common/Loader';

function AssignUser() {
  const { id } = useParams();

  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [loader, setloader] = useState(true);
  const [assignUser, setAssignUser] = useState({
    id: id,
  });
  const history = useHistory();
  useEffect(() => {
    let formData = new FormData();
    formData.append('booklet', id);

    fetch('https://etma-sql.herokuapp.com/api/tasks/GetTasks/', {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ booklet: id }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result.data);
          setloader(false);
          setItems(result.data);
          $('.booklets').DataTable({
            ordering: false,
            dom: 'Bfrtip',
            buttons: [
              {
                extend: 'pdf',
                footer: true,
                exportOptions: {
                  columns: [1, 2, 3, 4, 5],
                },
              },
              {
                extend: 'csv',
                footer: false,
                exportOptions: {
                  columns: [1, 2, 3, 4, 5],
                },
              },
            ],
            bDestroy: true,
            language: {
              lengthMenu: '_MENU_ bản ghi trên trang',
              search: '<i className="fa fa-search"></i>',
              searchPlaceholder: 'Search',
            },
          });
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
    let formData = new FormData();
    formData.append('booklet', id);

    fetch('https://etma-sql.herokuapp.com/api/booklets/GetBookletUsers/' + id)
      .then((res) => res.json())
      .then(
        (result) => {
          setUsers(result.data);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setError(error);
        }
      );
  }, []);

  const deleteItem = (itemID) => {
    Swal.fire({
      title: 'Are you sure, you want to delete this Booklet?',
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
        fetch(
          `https://etma-sql.herokuapp.com/api/booklets/DeleteBooklet/${itemID}`,
          {
            method: 'POST',
          }
        )
          .then(function (res) {
            return res.json();
          })
          .then(function (result) {
            $('.booklets')
              .DataTable()
              .row($('#' + itemID))
              .remove()
              .draw();
          });
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  };

  const assignTask = (e, itemId, taskId) => {
    e.preventDefault();
    assignUser.assignedTo = itemId;
    assignUser.id = taskId;
    fetch('https://etma-sql.herokuapp.com/api/tasks/assignTask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assignUser),
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
          $(e.target)
            .closest('tr')
            .children('td')
            .find('select')
            .attr('disabled', 'true');
          $(e.target).css('display', 'none');
          Swal.fire({
            title: 'User Assigned',
            text: '',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'ok',
            showCloseButton: false,
          });
        }
      });
  };

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Assign User</title>
      </Helmet>
      <main className='manage-users-main'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-12'>
              <div className='dashboardheaderbar d-flex justify-content-between align-items-center'>
                <Link to='/assign-booklet'>
                  <h1 className='dashboardtitle create-dashboardtitle'>
                    <div className='arrow-icon-dashboardtitle'>
                      <img src='/assets/images/Back.png' alt='back arrow' />
                    </div>
                    Assign User Task
                  </h1>
                </Link>
                {/* <div className='btngroup'>
                <Link to='/assign-booklet'>
                  <button
                    type='button'
                    className='btn btn-outline-primary dashboardtitle-btn'
                  >
                    Assign Booklet
                  </button>
                </Link>
              </div> */}
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
                    <table className='booklets'>
                      <thead>
                        <tr>
                          <th>Sr No</th>
                          <th>Task Name</th>
                          <th>Category</th>
                          <th>QT-Repetition</th>
                          <th>QST-Repetition</th>
                          <th>Users</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) =>
                          item.assignedUser === '' ? (
                            <tr id={item.id} key={item.id}>
                              <td>{index + 1}</td>
                              <td className='taskname_width'>{item.name}</td>
                              <td className='taskcategory_width'>
                                {item.category}
                              </td>
                              <td>{item.qtRepetition}</td>
                              <td>{item.qstRepetition}</td>
                              <td>
                                {' '}
                                <select
                                  id={'usersselect' + (index + 1)}
                                  name={'usersselect' + (index + 1)}
                                  className='form-control add-form-control'
                                  required
                                  onChange={(event) => {
                                    let newArr = [...items]; // copying the old datas array
                                    newArr[index].assignedTo =
                                      event.target.value; // replace e.target.value with whatever you want to change it to

                                    setItems(newArr); // ??
                                  }}
                                >
                                  {users.length === 0 ? (
                                    <option>No Users Assigned</option>
                                  ) : (
                                    <>
                                      <option value=''>
                                        Please select User
                                      </option>
                                      {users.map((useritem) => {
                                        return (
                                          <option
                                            value={useritem._id}
                                            key={useritem._id}
                                            selected={
                                              useritem._id === item.userId
                                                ? 'selected'
                                                : ''
                                            }
                                          >
                                            {useritem.name}
                                          </option>
                                        );
                                      })}
                                    </>
                                  )}
                                </select>
                              </td>
                              <td>
                                <div className='actionbtns'>
                                  <button
                                    className='listcardtable__actionbtn btn btn-primary'
                                    onClick={(e) =>
                                      assignTask(e, item.assignedTo, item._id)
                                    }
                                  >
                                    Assign User
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            <tr id={item.id} key={item.id}>
                              <td>{index + 1}</td>
                              <td className='taskname_width'>{item.name}</td>
                              <td className='taskcategory_width'>
                                {item.category}
                              </td>
                              <td>{item.qtRepetition}</td>
                              <td>{item.qstRepetition}</td>
                              <td>
                                {' '}
                                <input
                                  className='form-control'
                                  type='text'
                                  value={item.assignedUser}
                                  disabled
                                />
                                <h2 hidden>{item.assignedUser}</h2>
                              </td>
                              <td></td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
export default AssignUser;
