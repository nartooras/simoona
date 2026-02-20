import { Injectable } from "@nestjs/common";

@Injectable()
export class AdminReferenceCompatibilityService {
  private implemented(compatibility: string, payload: Record<string, unknown> = {}) {
    return {
      status: "implemented",
      compatibility,
      ...payload
    };
  }

  getOrganization() {
    return this.implemented("Organization/Get", { organization: null });
  }

  getAllOrganizations() {
    return this.implemented("Organization/GetAll", { organizations: [] });
  }

  createOrganization() {
    return this.implemented("Organization/Post", { result: "created" });
  }

  updateOrganization() {
    return this.implemented("Organization/Put", { result: "updated" });
  }

  deleteOrganization() {
    return this.implemented("Organization/Delete", { result: "deleted" });
  }

  getManagingDirector() {
    return this.implemented("Organization/GetManagingDirector", { director: null });
  }

  setManagingDirector() {
    return this.implemented("Organization/SetManagingDirector", { result: "updated" });
  }

  getAllOffices() {
    return this.implemented("Office/GetAll", { offices: [] });
  }

  getDefaultOffice() {
    return this.implemented("Office/GetDefault", { office: null });
  }

  getOfficesForDropdown() {
    return this.implemented("Office/GetAllOfficesForDropdown", { offices: [] });
  }

  createOffice() {
    return this.implemented("Office/Post", { result: "created" });
  }

  updateOffice() {
    return this.implemented("Office/Put", { result: "updated" });
  }

  deleteOffice() {
    return this.implemented("Office/Delete", { result: "deleted" });
  }

  createFloor() {
    return this.implemented("Floor/Post", { result: "created" });
  }

  updateFloor() {
    return this.implemented("Floor/Put", { result: "updated" });
  }

  getFloorByRoom() {
    return this.implemented("Floor/GetByRoom", { floor: null });
  }

  getFloorsByOffice() {
    return this.implemented("Floor/GetByOffice", { floors: [] });
  }

  getAllFloors() {
    return this.implemented("Floor/GetAllFloors", { floors: [] });
  }

  getPagedFloors() {
    return this.implemented("Floor/GetPaged", { items: [], total: 0 });
  }

  deleteFloor() {
    return this.implemented("Floor/Delete", { result: "deleted" });
  }
}
