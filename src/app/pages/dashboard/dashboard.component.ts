import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import {
  NgbAccordionModule,
  NgbModal,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from '../../common/interfaces/usuario';
import { Rol } from '../../common/interfaces/rol';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { PermisosService } from '../../services/permisos.service';
import { passwordValidator } from '../../common/validators/password-valido';
import { ErrorCode } from '../../common/enums/error-code';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApiService } from '../../services/api.service';
import { Pedido } from '../../common/interfaces/pedido';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgbNavModule,
    NavBarComponent,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbAccordionModule,
    DatePipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private modalService = inject(NgbModal);

  public usuarios: Usuario[] = [];
  public usuariosFiltrados: Usuario[] = [];
  public usuarioSeleccionado: any;
  public usuarioSeleccionadoId: any;

  public roles: Rol[] = [];
  public rolSeleccionadoId = 0;
  public rolModificado: Rol = {
    name: '',
  };

  public permisosPorRol: any = [];

  public pedidos: Pedido[] = [];

  active = 1;

  // Forms
  public usuarioNuevoForm: FormGroup;
  public usuarioModificadoForm: FormGroup;

  constructor(
    private usersService: UsersService,
    private permisosService: PermisosService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    // Forms - Validators - Usuario Nuevo
    this.usuarioNuevoForm = this.fb.group({
      userName: [undefined, Validators.required],
      documento: [undefined, Validators.required],
      password: [
        undefined,
        [Validators.required, Validators.minLength(4), passwordValidator()],
      ],
      roleId: [undefined, Validators.required],
    });

    // Forms - Validators - Modificar Usuario
    this.usuarioModificadoForm = this.fb.group({
      userName: [undefined, Validators.required],
      password: [undefined, [Validators.minLength(4), passwordValidator()]],
      documento: [undefined],
      roleId: [undefined, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getUsuarios();
    this.getRoles();
    this.getPedidos();
  }

  getUsuarios() {
    this.usersService.getUsers('users').subscribe({
      next: (result: any) => {
        console.log('los usuarios', result);
        this.usuarios = result;
        this.usuariosFiltrados = result;
      },
      error: (error: any) => {
        console.error(error);
        this.toastr.error(error.error.message, `Alert Status: ${error.status}`);

        if (error.status == ErrorCode.Unauthorized) {
          this.authService.logOut();
        }
      },
      complete: () => {
        // console.log('Completed');
      },
    });
  }

  getRoles() {
    this.usersService.getRoles('roles').subscribe({
      next: (result: any) => {
        console.log('los roles', result);
        this.roles = result;
      },
      error: (error: any) => {
        console.error(error);
      },
      complete: () => {
        // console.log('Completed');
      },
    });
  }

  getPedidos() {
    this.apiService.get('pedidos').subscribe({
      next: (result: any) => {
        console.log('pedidos obtenidos', result);
        this.pedidos = result;
      },
      error: (error: any) => {
        console.error(error);
      },
      complete: () => {
        console.log('Completed');
      },
    });
  }

  guardarUsuarioNuevo() {
    const newUser = this.usuarioNuevoForm.value;

    this.usersService.postUser('users', newUser).subscribe({
      next: (result: any) => {
        console.log(result);
        this.toastr.success('Usuario registrado correctamente');
        this.getUsuarios();
      },
      error: (error: any) => {
        console.error(error);
        this.toastr.error(
          'Error al intentar registrar el usuario',
          `Alert Status: ${error.status}`
        );
      },
      complete: () => {
        console.log('Completed');
      },
    });
  }

  guardarUsuarioModificado() {
    console.log('Usuario modificado', this.usuarioModificadoForm.value);

    const { userName, password, documento, roleId } =
      this.usuarioModificadoForm.value;

    let usuarioModificado;

    if (password) {
      usuarioModificado = this.usuarioModificadoForm.value;
    } else {
      usuarioModificado = {
        userName,
        documento,
        roleId,
      };
    }

    this.usersService
      .updateUser('users/' + this.usuarioSeleccionadoId, usuarioModificado)
      .subscribe({
        next: (result: any) => {
          console.log(result);
          if (result.status == 200) {
            this.toastr.success(result.message);
          }
          this.getUsuarios();
        },
        error: (error: any) => {
          console.error(error);
          this.toastr.warning(error.error.message, 'Alert');
        },
        complete: () => {
          console.log('Completed');
        },
      });
  }

  guardarCambiosRol() {
    console.log(this.rolModificado);
  }

  // Modal rol
  llenarModalRol(value: Rol) {
    console.log('rol seleccionado', value);

    this.rolModificado.name = value.name;
  }

  cambiarEstado() {
    this.toastr.success('Estado actualizado correctamente', 'Alert');
  }

  // Seleccion de usuario en la busqueda
  seleccionarUsuario() {
    console.log('usuario seleccionado', this.usuarioSeleccionadoId);

    if (this.usuarioSeleccionadoId) {
      this.usuariosFiltrados = this.usuarios.filter(
        (user: any) => user.userId == this.usuarioSeleccionadoId
      );
    } else {
      this.usuariosFiltrados = this.usuarios;
    }
  }

  // Seleccion de rol
  seleccionarRol(value: any) {
    console.log('Rol seleccionado', value);
    this.rolSeleccionadoId = value.roleId;

    // this.permisosService.getPermisos('permisos/' + value.roleId).subscribe({
    //   next: (result: any) => {
    //     console.log('Permisos por el rol seleccionado', result);
    //     this.permisosPorRol = result;

    //     for (let item of result) {
    //       for (let modulo of this.modulos) {
    //         if (item.moduloId == modulo.moduloId) {
    //           this.modulosRoles.push(modulo);
    //         }
    //       }
    //     }

    //     this.modulosSeleccionados = this.modulosRoles;

    //     console.log(
    //       'Los modulos habilitados por el rol seleccionado',
    //       this.modulosRoles
    //     );
    //   },
    //   error: (error: any) => {
    //     console.error(error);
    //   },
    //   complete: () => {
    //     console.log('Completed');
    //   },
    // });
  }

  // Agregar modulo al rol seleccionado
  add(value: any) {
    console.log('el agregado es', value);

    const newPermiso = {
      roleId: this.rolSeleccionadoId,
      moduloId: value.moduloId,
    };

    this.permisosService.postPermiso('permisos', newPermiso).subscribe({
      next: (result: any) => {
        console.log(result);
        this.toastr.success('Permiso agregado correctamente');
      },
      error: (error: any) => {
        console.error(error);
        this.toastr.error(error.error.message);
      },
      complete: () => {
        console.log('Completed');
      },
    });
  }

  // Quitar modulo al rol seleccionado
  remove(value: any) {
    console.log('el eliminado es', value);

    console.log('los permisos del rol', this.permisosPorRol);

    const permisoEliminado = this.permisosPorRol.find(
      (permiso: any) => permiso.moduloId == value.moduloId
    );

    console.log('el id del permiso a eliminar es', permisoEliminado.permisoId);

    this.permisosService
      .deletePermiso('permisos/' + permisoEliminado.permisoId)
      .subscribe({
        next: (result: any) => {
          console.log(result);
          this.toastr.success('Permiso eliminado correctamente');
        },
        error: (error: any) => {
          console.error(error);
          this.toastr.error(error.error.message);
        },
        complete: () => {
          console.log('Completed');
        },
      });
  }

  // Validar el formulario antes de guardar
  validarUsuarioForm() {
    console.log('Validacion del formulario', this.usuarioNuevoForm.valid);

    if (this.usuarioNuevoForm.valid) {
      // console.log('Form Submitted!', this.usuarioNuevoForm.value);
      this.closeModal();
      this.guardarUsuarioNuevo();
    } else {
      // Marca todos los campos como "tocados" para activar las validaciones
      this.usuarioNuevoForm.markAllAsTouched();
    }
  }

  validarUsuarioModificadoForm() {
    console.log('Validacion del formulario', this.usuarioModificadoForm.valid);

    if (this.usuarioModificadoForm.valid) {
      // console.log('Form Submitted!', this.usuarioModificadoForm.value);
      this.closeModal();
      this.guardarUsuarioModificado();
    } else {
      // Marca todos los campos como "tocados" para activar las validaciones
      this.usuarioModificadoForm.markAllAsTouched();
    }
  }

  // Open modal - Nuevo usuario
  openModalNuevoUsuario(content: TemplateRef<any>) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          // this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  // Open modal - Modificar usuario
  openModalModificarUsuario(
    content: TemplateRef<any>,
    usuarioSeleccionado: any
  ) {
    console.log(usuarioSeleccionado);

    this.usuarioSeleccionadoId = usuarioSeleccionado.userId;

    this.usuarioModificadoForm.setValue({
      userName: usuarioSeleccionado.userName,
      password: null,
      documento: usuarioSeleccionado.documento,
      roleId: usuarioSeleccionado.roleId,
    });

    this.modalService.open(content).result.then(
      (result) => {
        // this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  // Close modal
  closeModal() {
    console.log('close modal');
    this.modalService.dismissAll();
  }
}
