import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import { Roles } from '../../common/enums/roles';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  public token: string = '';

  public users: any = [];

  // Inputs
  user = {
    documento: '',
  };

  constructor(
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.authService.logOut();
  }

  login() {
    this.authService.logIn('auth/login', this.user).subscribe({
      next: (result: any) => {
        // console.log(result);

        const { accessToken, userId, roleId, userName } = result;

        // Si es admin se loguea y redirigue a la pagina de pedidos
        if (roleId == Roles.Admin) {
          if (accessToken) {
            this.toastr.success('Acceso correcto', 'Alert');
            localStorage.setItem('authToken', accessToken);
            localStorage.setItem('userId', userId);
            localStorage.setItem('userName', userName);

            this.authService.setAuth(true);

            // Luego de loguear navegar a:
            this.router.navigate(['/pedidos']);
          }
        } else {

          // Si no es admin se consulta por el pedido existente de ese usuario
          this.apiService.get('pedidos/user/' + userId).subscribe({
            next: (result: any) => {
              // console.log('El pedido del usuario logueado', result);

              // Si ya tiene un pedido cargado el día de hoy se bloquea el acceso y muestra la alerta
              if (result) {
                this.toastr.warning(
                  `Ya tiene un pedido cargado a su nombre hoy, su pedido es: ${result.menuRelated.name}`,
                  'Alert',
                  {
                    positionClass: 'toast-top-full-width',
                  }
                );
              } else {

                // Si no tiene pedido cargado el día de hoy se loguea normalmente y navega a la pagina de menus
                if (accessToken) {
                  this.toastr.success('Acceso correcto', 'Alert');
                  localStorage.setItem('authToken', accessToken);
                  localStorage.setItem('userId', userId);
                  localStorage.setItem('userName', userName);

                  this.authService.setAuth(true);

                  // Luego de loguear navegar a:
                  this.router.navigate(['/menus']);
                }
              }
            },
            error: (error: any) => {
              console.error(error);
            },
            complete: () => {
              console.log('Completed');
            },
          });
        }
      },
      error: (error: any) => {
        console.log(error);

        this.toastr.error(error.error.message, 'Alert');
      },
    });
  }
}
