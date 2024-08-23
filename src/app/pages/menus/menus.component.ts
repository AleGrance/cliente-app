import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Menu } from '../../common/interfaces/menu';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menus',
  standalone: true,
  imports: [],
  templateUrl: './menus.component.html',
  styleUrl: './menus.component.scss',
})
export class MenusComponent implements OnInit {
  public usuarioLogueadoId: number = 0;

  public menus: Menu[] = [];

  public menuSeleccionado: Menu = {
    name: '',
    menuId: undefined,
  };

  constructor(private apiService: ApiService, private toastrService: ToastrService, private authService: AuthService) {}

  ngOnInit(): void {
    this.obtenerMenus();
    this.usuarioLogueadoId = parseInt(localStorage.getItem('userId')!);
  }

  obtenerMenus() {
    this.apiService.get('menus').subscribe({
      next: (result: any) => {
        console.log('menus obtenidos', result);
        this.menus = result;
      },
      error: (error: any) => {
        console.error(error);
      },
      complete: () => {
        console.log('Completed');
      },
    });
  }

  seleccionMenu(menu: any) {
    console.log(menu);

    this.menuSeleccionado = menu;
  }

  confirmarPedido() {
    const newPedido = {
      userId: this.usuarioLogueadoId,
      menuId: this.menuSeleccionado.menuId,
      estadoId: 1,
      fechaPedido: new Date(),
    };

    console.log(newPedido);

    this.apiService.post('pedidos', newPedido).subscribe({
      next: (result: any) => {
        console.log('pedido registrado', result);
        this.toastrService.success('Pedido registrado correctamente', 'Alert');

        setTimeout(() => {
          this.authService.logOut();
        }, 3000);
      },
      error: (error: any) => {
        console.error(error);
      },
      complete: () => {
        console.log('Completed');
      },
    });
  }
}
