import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, NgbCollapseModule, RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {
  isMenuCollapsed = true;

  public losPermisosId: number[] = [];

  public usuarioLogueado: string = '';
  public roleId: string = '';

  constructor(private authService: AuthService) {
    
  }

  ngOnInit(): void {
    this.usuarioLogueado = localStorage.getItem('userName')!;
    this.roleId = localStorage.getItem('roleId')!;
  }

  logOut() {
    this.authService.logOut();
  }

}
