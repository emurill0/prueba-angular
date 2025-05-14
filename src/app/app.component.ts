import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './servicios/api.service';
import Swal from 'sweetalert2';

// @ts-ignore
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private apiService = inject(ApiService);

  productos: any[] = [];
  formulario = { title: '', price: null, image: '' };
  editando = false;
  productoId: number | null = null;

  productoAEliminar: any = null;

  constructor() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.apiService.obtenerProductos().subscribe(res => {
      this.productos = res.slice(0, 12); // mostrar 12 productos máximo
    });
  }

  guardar() {
  const data = {
    title: this.formulario.title,
    price: this.formulario.price,
    images: [this.formulario.image],
    description: 'Producto de ejemplo',
    categoryId: 1
  };

  if (this.editando && this.productoId !== null) {
    this.apiService.actualizarProducto(this.productoId, data).subscribe(() => {
      this.cancelar();
      this.cargarProductos();
      Swal.fire('Actualizado', 'Producto actualizado correctamente.', 'success');
    });
  } else {
    this.apiService.crearProducto(data).subscribe(() => {
      this.formulario = { title: '', price: null, image: '' };
      this.cargarProductos();
      Swal.fire('Creado', 'Producto creado correctamente.', 'success');
    });
  }
}

  editar(producto: any) {
    this.editando = true;
    this.productoId = producto.id;
    this.formulario = {
      title: producto.title,
      price: producto.price,
      image: producto.images[0]
    };
  }

  cancelar() {
    this.editando = false;
    this.productoId = null;
    this.formulario = { title: '', price: null, image: '' };

  }

  abrirModalEliminar(producto: any) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: `¿Deseas eliminar el producto "${producto.title}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.apiService.eliminarProducto(producto.id).subscribe(() => {
        this.cargarProductos();
        Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
      });
    }
  });
}


  confirmarEliminar() {
    if (this.productoAEliminar) {
      this.apiService.eliminarProducto(this.productoAEliminar.id).subscribe(() => {
        this.cargarProductos();
        const modalElement = document.getElementById('modalEliminar');
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal?.hide();
        }
        this.productoAEliminar = null;
        location.reload();
      });
    }
  }
}