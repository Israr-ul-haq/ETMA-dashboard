import {Link} from "react-router-dom";

function Filter(){
    return(
        <main className="manage-users-main">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="filter-user-top-bar">
                            <div className="arrow-icon-dashboardtitle">
                                <img src="images/Back.png" alt="" />
                            </div>
                            <div
                                className="dashboardheaderbar filter-user-dashboardheaderbar d-flex justify-content-between align-items-center">
                                <h1 className="dashboardtitle filter-dashboardtitle">Filter</h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">

                    <div className="col-12">
                        <div className="card mb-4">
                            <div className="card-body">
                                <form className="add-new" action="/users">
                                    <div className="form-2">
                                        <div className="row form-inner-row">
                                            <div className="form-group name-field col-md-4">
                                                <label htmlFor="form-label">User Name</label>
                                                <input type="text" className="form-control add-form-control"
                                                       id="InputName"
                                                       placeholder="Adam Hawkins" required />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="inputEmail" className="col-form-label">Email</label>
                                                <input type="email" className="form-control add-form-control"
                                                       id="inputEmail" placeholder="Amber@gmail.com" required />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="inputID" className="col-form-label">ID</label>
                                                <input type="number" className="form-control add-form-control"
                                                       id="inputID"
                                                       placeholder="05" required />
                                            </div>
                                        </div>
                                        <div className="row form-inner-row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="form-label">Batch No</label>
                                                <input type="number" className="form-control add-form-control"
                                                       id="inputBatchNo"
                                                       placeholder="02" required />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="form-label">Role</label>
                                                <input type="text" className="form-control add-form-control"
                                                       id="inputRole"
                                                       placeholder="Supervisor" required />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="form-label">Department</label>
                                                <input type="text" className="form-control add-form-control"
                                                       id="Inputdept"
                                                       placeholder="Tech" required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-btns">
                                        <button type="submit"
                                                className="btn form-btn btn-outline-primary apply-btn mb-0">Apply
                                        </button>
                                        <Link to="/users"
                                                className="btn form-btn btn-primary cancel-btn mb-0">Cancel
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Filter;