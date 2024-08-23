export interface Pedido {
  pedidoId?: number;
  fechaPedido: Date;

  userId: number;
  menuId: number;
  estadoId: number;

  userRelated: {
    name: string;
  };
  menuRelated: {
    name: string;
  };
  estadoRelated: {
    name: string;
    class: string;
  };

  createdAt?: Date;
  updatedAt?: Date;

  // se agrega en el onInit
  class?: string;
}
