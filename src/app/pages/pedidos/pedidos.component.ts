import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Pedido } from '../../common/interfaces/pedido';
import { Menu } from '../../common/interfaces/menu';
import { Estado } from '../../common/interfaces/estado';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [NgSelectModule, FormsModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.scss',
})
export class PedidosComponent implements OnInit {
  public pedidos: Pedido[] = [];
  public menus: Menu[] = [];
  public menusHabilitados: any = [];
  public estados: Estado[] = [];
  public estadoSeleccionado: any;

  constructor(private apiService: ApiService, private toastrService: ToastrService) {}

  ngOnInit(): void {

    this.getMenus();
    this.getEstados();
  }

  getMenus() {
    this.apiService.get('menus').subscribe({
      next: (result: any) => {
        console.log('los menus', result);
        this.menus = result;

        for (let menu of this.menus) {
          const menuCantidad = {
            name: menu.name,
            cantidad: 0,
          };
          this.menusHabilitados.push(menuCantidad);
        }

        console.log('los menus habilitados son', this.menusHabilitados);

        this.getPedidos();
      },
      error: (error: any) => {
        console.error(error);
      },
      complete: () => {
        console.log('Completed');
      },
    });
  }

  getPedidos() {
    this.apiService.get('pedidos/hoy').subscribe({
      next: (result: any) => {
        console.log('pedidos de hoy obtenidos', result);
        this.pedidos = result;

        for (let pedido of this.pedidos) {
          for (let menu of this.menusHabilitados) {
            if (pedido.menuRelated.name == menu.name) {
              menu.cantidad += 1;
            }
          }
        }

        console.log(
          'los menus habilitados con cantidades',
          this.menusHabilitados
        );
      },
      error: (error: any) => {
        console.error(error);
      },
      complete: () => {
        console.log('Completed');
      },
    });
  }

  getEstados() {
    this.apiService.get('estados').subscribe({
      next: (result: any) => {
        console.log('los estados obtenidos', result);
        this.estados = result;
      },
      error: (error: any) => {
        console.error(error);
      },
      complete: () => {
        console.log('Completed');
      },
    });
  }

  changeEstado(pedidoId: any, estadoId: any) {
    console.log(pedidoId);
    console.log(estadoId);

    const pedidoStatus = {
      estadoId: estadoId,
    };

    console.log(pedidoStatus);

    this.apiService.patch('pedidos/' + pedidoId, pedidoStatus).subscribe({
      next: (result: any) => {
        console.log(result);
        this.getPedidos();

        this.toastrService.success(result.message, 'Alert');
      },
      error: (error: any) => {
        console.error(error);

        this.toastrService.warning(error.error.message, 'Alert');
      },
      complete: () => {
        console.log('Completed');
      },
    });
  }
}
