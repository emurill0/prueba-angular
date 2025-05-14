import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private API_URL = 'https://api.escuelajs.co/api/v1/products';

  constructor(private http: HttpClient) {}

  // Leer todos los productos
  obtenerProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  // Crear un nuevo producto
  crearProducto(data: any): Observable<any> {
    return this.http.post(this.API_URL, data);
  }

  // Editar un producto existente
  actualizarProducto(id: number, data: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, data);
  }

  // Eliminar un producto
  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
