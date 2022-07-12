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

export type Status = "On order" | "Ordered" | "Prepared" | "Delivered" | "Received";

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
  restaurant_id: string
};

export type OrderItem = {
  id: string
  name: string,
  quantity: Array<number>,
  container: Array<Container>,
  priority: number
}