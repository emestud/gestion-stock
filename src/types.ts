export type Restaurant = {
  id: string,
  name: string,
  address: string
};

export type Item = {
  id: string,
  name: string,
  quantity: number,
  container: string,
  container_id: string,
  priority: number
};

export type Container = {
  name: string,
  id: string
};

export type ContainerCategory = {
  name: string,
  containers: Array<Container>
};

export type User = {
  id: string,
  username: string,
  role: Role,
  restaurant_id: string
};

export type Status = "On order" | "Ordered" | "Prepared" | "Delivered" | "Received" | null;

type Role = "Admin" | "Manager" | "Labo" | "Livreur" | "Anon";

export type ItemCategory = {

  name: string,
  items: Array<Item>

};

export type Order = {
  id: string,
  items: Array<OrderItem>,
  status: Status,
  comment: string
  created_at: string,
  restaurant_id: string,
};

export type OrderTuple = {
  originalOrder: Order,
  modifiedOrder: Order
}

export type Waste = {
  id: string,
  items: Array<OrderItem>,
  status: Status,
  comment: string
  created_at: string,
  restaurant_id: string,
};

export type OrderItem = {
  id: string
  name: string,
  quantity: Array<number>,
  container: Array<Container>,
  priority: number,
  category: string
}

export interface RestaurantName {
  restaurant: string
}

export interface CanceledByLab {
  canceledByLab: boolean
}

export type LabItem = {
  name: string,
  priority: number,
  containers: Array<RestaurantName & string>,
  quantities: Array<RestaurantName & number>,
  canceledByLab: boolean
}


interface _Quantity {
  quantity: number
}

interface _Container {
  container: string
}

interface ItemOrderID {
  item_order_id: string
}

export type LabItemInfo = ItemOrderID & RestaurantName & (_Quantity | _Container);


export type ItemWithLabInfo = Omit<Item, 'container_id'> & RestaurantName & CanceledByLab;