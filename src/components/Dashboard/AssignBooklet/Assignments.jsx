import $ from 'jquery';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Link, useParams, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Loader from '../../Common/Loader';

function Assignments() {
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [roles, setroles] = useState([]);
  const [loader, setloader] = useState(true);
  const history = useHistory();

  const showMore = (e) => {
    debugger;
    e.preventDefault();
    // toggle 'more' class in the closest parent table cell
    $(e.target).closest('td').toggleClass('more');

    // Change text of link
    if ($(e.target).text() === 'show more') {
      $(e.target).text('show less');
    } else {
      $(e.target).text('show more');
    }
  };

  useEffect(() => {
    fetch('https://etma-sql.herokuapp.com/api/booklets/GetPublishedBooklets')
      .then((res) => res.json())
      .then(
        (result) => {
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
                  columns: [1, 2, 3, 4],
                },
              },
              {
                extend: 'csv',
                footer: false,
                exportOptions: {
                  columns: [1, 2, 3, 4],
                },
              },
            ],
            bDestroy: true,
            language: {
              lengthMenu: '_MENU_ bản ghi trên trang',
              search: '<i className="fa fa-search"></i>',
              searchPlaceholder: 'Search',
            },
            initComplete: function (settings, json) {
              $('.dt-buttons').prepend(
                "<h4 class='export_title'>Export Booklets:</h4>"
              );
              $('.dt-buttons').wrapInner("<div class='wrapElement'></div>");

              $('.dt-buttons').append(
                `<div className="importuserscontainer">
                
                </div>`
              );
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
            window.location.reload(false);
          });
        // Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  };

  useEffect(() => {
    fetch(`https://etma-sql.herokuapp.com/api/roles`)
      .then((res) => res.json())
      .then(
        (result) => {
          setroles(result.data);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setError(error);
        }
      );
  }, []);

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Assign Booklet </title>
      </Helmet>
      <main className='manage-users-main'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-12'>
              <div className='dashboardheaderbar d-flex justify-content-between align-items-center'>
                <h1 className='dashboardtitle'>Assign Booklet</h1>
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
                          <th>Booklet Name</th>
                          <th>Users</th>
                          <th>Type</th>
                          <th>QT</th>
                          <th>QST</th>
                          <th>Published Date</th>
                          <th>Version</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => (
                          <tr id={item.id} key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>
                              <div className='assignusers_width'>
                                {item.assignedTo.length !== 0
                                  ? item.assignedTo.map((x, index, array) => {
                                      if (index === array.length - 1) {
                                        return <> {x.name} </>;
                                      } else {
                                        return (
                                          <>
                                            {' '}
                                            {x.name + ', '} <br />{' '}
                                          </>
                                        );
                                      }
                                    })
                                  : 'No Users Assigned'}
                              </div>
                              <a
                                onClick={showMore}
                                href='#'
                                class='toggle-more'
                              >
                                show more
                              </a>
                            </td>
                            <td>{item.type}</td>
                            <td>{item.repetitions[0].name}</td>
                            <td>
                              {item.repetitions[1]
                                ? item.repetitions[1].name
                                : '-'}
                            </td>

                            <td>
                              {new Date(item.publishedDate).toLocaleString()}
                            </td>
                            <td>{item.version}</td>
                            <td>
                              <div className='actionbtns'>
                                <Link
                                  to={`/assign-booklet/${item.id}`}
                                  className='listcardtable__actionbtn'
                                >
                                  <img
                                    src='/assets/images/Edit.svg'
                                    alt='edit data table'
                                  />
                                </Link>
                                <Link
                                  to={`/assign-booklet/tasks/${item.id}`}
                                  className='listcardtable__actionbtn'
                                >
                                  <img
                                    src='/assets/images/task.svg'
                                    alt='edit data table'
                                  />
                                </Link>
                                {/* <a
                                href='#'
                                data-toggle='modal'
                                data-target='.blockUserModal'
                              >
                                <img
                                  src='./assets/images/Block.png'
                                  alt='block data table'
                                />
                              </a> */}
                                <button
                                  style={{
                                    padding: '0',
                                    backgroundColor: 'unset',
                                    border: 'unset',
                                  }}
                                  className='listcardtable__actionbtn'
                                  onClick={() => deleteItem(item.id)}
                                >
                                  <img
                                    src='/assets/images/delete.svg'
                                    alt='delete data table'
                                  />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
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
export default Assignments;
