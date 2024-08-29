import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-control',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './control.component.html',
  styleUrl: './control.component.scss',
})
export class ControlComponent implements OnInit {
  public users: any = [];

  // Inputs
  user = {
    userName: '',
    password: '',
  };

  // flags
  public showLoadingComponent: boolean = false;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    // this.authService.logOut();
  }

  login() {
    this.authService.logIn('auth/login', this.user).subscribe({
      next: (result: any) => {
        // console.log(result);

        const { accessToken, userName, roleId, codVendedor } = result;

        if (accessToken) {
          this.toastr.success('Acceso correcto', 'Alert');
          localStorage.setItem('authToken', accessToken);
          localStorage.setItem('userName', userName);
          localStorage.setItem('roleId', roleId);

          if (codVendedor) {
            localStorage.setItem('codVendedor', codVendedor);
          }

          this.authService.setAuth(true);

          // Luego de loguear navegar a:
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error: any) => {
        console.log(error);

        this.toastr.error(error.error.message, 'Alert');
      },
    });
  }

  showPass() {
    const element = this.el.nativeElement.querySelector('#password');

    if (element.getAttribute('type') == 'password') {
      this.renderer.setAttribute(element, 'type', 'text');
    } else {
      this.renderer.setAttribute(element, 'type', 'password');
    }
  }
}
