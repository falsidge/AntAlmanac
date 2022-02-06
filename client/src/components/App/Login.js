import React, { Fragment, PureComponent } from 'react';
import { CloudDownload, Save } from '@material-ui/icons';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TableBody,
    TextField,
} from '@material-ui/core';
import { login, logout } from '../../actions/AppStoreActions';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Magic, RPCError, RPCErrorCode } from 'magic-sdk';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';

import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';

const m = new Magic('pk_live_14BF4F1546CA8158');
const headCells = [
    {
        id: 'schedule 1',
    },
    {
        id: 'schedule 2',
    },
    {
        id: 'schedule 3',
    },
];
class LoginButtonBase extends PureComponent {
    state = {
        isOpen: false,
        email: '',
        isLoggedIn: false,
        rememberMe: true,
    };

    handleOpen = () => {
        this.setState({ isOpen: true });
        if (typeof Storage !== 'undefined') {
            const email = window.localStorage.getItem('email');
            if (email !== null) {
                this.setState({ email: email });
            }
        }
    };

    handleClose = (wasCancelled) => {
        if (wasCancelled)
            this.setState({ isOpen: false }, () => {
                document.removeEventListener('keydown', this.enterEvent, false);
                this.setState({ email: '' });
            });
        else {
            this.setState({ isOpen: false }, () => {
                document.removeEventListener('keydown', this.enterEvent, false);
                if (this.state.isLoggedIn) {
                    logout().then((success) => {
                        if (!success) {
                            m.user.isLoggedIn().then((resp) => this.setState({ isLoggedIn: resp }));
                        }
                    });
                } else {
                    login(this.state.email, this.state.rememberMe).then((success) => {
                        if (!success) {
                            m.user.isLoggedIn().then((resp) => this.setState({ isLoggedIn: resp }));
                        }
                    });
                }
                this.setState({ email: '' });
            });
        }
    };

    handleToggleRememberMe = (event) => {
        this.setState({ rememberMe: event.target.checked });
    };
    componentDidMount() {
        m.user.isLoggedIn().then((resp) => this.setState({ isLoggedIn: resp }));
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevState.isOpen && this.state.isOpen) document.addEventListener('keydown', this.enterEvent, false);
        else if (prevState.isOpen && !this.state.isOpen)
            document.removeEventListener('keydown', this.enterEvent, false);
    }

    enterEvent = (event) => {
        const charCode = event.which ? event.which : event.keyCode;

        if (charCode === 13 || charCode === 10) {
            event.preventDefault();
            this.handleClose(false);

            return false;
        }
    };

    render() {
        if (this.state.isLoggedIn) {
            return (
                <Fragment>
                    <Button
                        onClick={this.handleOpen}
                        color="inherit"
                        startIcon={this.props.actionName === 'Save' ? <Save /> : <CloudDownload />}
                    >
                        {' '}
                        Manage
                    </Button>
                    <Dialog open={this.state.isOpen}>
                        <DialogTitle>Manage Schedules</DialogTitle>
                        <DialogContent>
                            <TableContainer>
                                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
                                    <TableBody>
                                        {headCells.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.id}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    <Button>Delete</Button>
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    <Button>Save</Button>
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    <Button>Load</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => {
                                    this.handleClose(true);
                                    logout();
                                    m.user.isLoggedIn().then((resp) => this.setState({ isLoggedIn: resp }));
                                }}
                                color="primary"
                            >
                                Logout
                            </Button>
                            <Button onClick={() => this.handleClose(true)} color="primary">
                                Cancel
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <Button
                        onClick={this.handleOpen}
                        color="inherit"
                        startIcon={this.props.actionName === 'Save' ? <Save /> : <CloudDownload />}
                    >
                        {' '}
                        Login
                    </Button>
                    <Dialog open={this.state.isOpen}>
                        <DialogTitle>Login</DialogTitle>
                        <DialogContent>
                            <DialogContentText>Enter your Email here to login.</DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Email"
                                type="text"
                                fullWidth
                                placeholder="Enter here"
                                value={this.state.email}
                                onChange={(event) => this.setState({ email: event.target.value })}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.rememberMe}
                                        onChange={this.handleToggleRememberMe}
                                        color="primary"
                                    />
                                }
                                label="Remember Me (Uncheck on shared computers)"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => this.handleClose(true)} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={() => this.handleClose(false)} color="primary">
                                Login
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Fragment>
            );
        }
    }
}

const LoginFunctionality = () => {
    return (
        <Fragment>
            <LoginButtonBase action={login} />
        </Fragment>
    );
};

export default LoginFunctionality;
