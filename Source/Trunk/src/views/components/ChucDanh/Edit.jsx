import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import svc from '../../../services/chucdanh.service';

export default class EditChucDanh extends React.Component {
    state = {
        open: false,
        model: {},

    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };
    handleSave = () => {
        //this.setState({ open: false });
        let model = this.state.model;
        svc.create(model).then(res => {
            this.setState({ open: false });
        });
    };
    handleOnChange = (e) => {
        let model = this.state.model;
        let name = e.target.name;
        model[name] = e.target.value;
        this.setState({ model });
    };

    render() {
        return (
            <div>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Chức danh</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="maChucDanh"
                            label="Mã chức danh"
                            type="text"
                            onChange={(e) => this.handleOnChange(e)}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            name="tenChucDanh"
                            label="Tên chức danh"
                            type="text"
                            onChange={(e) => this.handleOnChange(e)}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Đóng
                        </Button>
                        <Button onClick={this.handleSave} color="primary">
                            Lưu
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}