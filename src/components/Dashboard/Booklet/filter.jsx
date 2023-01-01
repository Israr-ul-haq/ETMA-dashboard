function Filter(){
    return(
        <main className="manage-users-main">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="filter-user-top-bar">
                            <div className="arrow-icon-dashboardtitle">
                                <img src="./assets/images/Back.png" />
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
                                <form className="add-new">

                                    <div className="form-2">
                                        <div className="row form-inner-row">
                                            <div className="form-group name-field col-md-4">
                                                <label htmlFor="form-label">Booklet Name</label>
                                                <input type="text" className="form-control add-form-control"
                                                       id="InputName"
                                                       placeholder="Booklet 1" required />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="inputEmail" className="col-form-label">Created
                                                    Date</label>
                                                <input type="date" className="form-control add-form-control"
                                                       id="inputdatecreated" placeholder="28-02-2021" required />
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
                                                <label htmlFor="form-label">Published Date</label>
                                                <input type="date" className="form-control add-form-control"
                                                       id="inputdatepublished"
                                                       placeholder="28-02-2021" required />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="form-label">Type</label>
                                                <input type="text" className="form-control add-form-control"
                                                       id="inputType"
                                                       placeholder="GMT" required />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="form-label">Version</label>
                                                <input type="number" className="form-control add-form-control"
                                                       id="inputVersion"
                                                       placeholder="1.0.0" required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-btns">
                                        <button type="submit"
                                                className="btn form-btn btn-outline-primary apply-btn mb-0">Apply
                                        </button>
                                        <button type="button"
                                                className="btn form-btn btn-primary cancel-btn mb-0">Cancel
                                        </button>
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