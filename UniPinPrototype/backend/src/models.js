export function buildValidateRequest({ userId, serverId, username }) {
  return {
    UserId: userId,
    ServerId: serverId,
    Username: username,
    Timestamp: new Date().toISOString(),
  }
}

export function buildOrderCreateRequest({ flowId, userId, serverId, username, supplierCheckoutRequest }) {
  return {
    FlowId: flowId,
    UserId: userId,
    ServerId: serverId,
    Username: username,
    Timestamp: new Date().toISOString(),
    SupplierCheckoutRequest: supplierCheckoutRequest,
  }
}

export function buildInquiryRequest({ flowId, userId, serverId, username }) {
  return {
    FlowId: flowId,
    UserId: userId,
    ServerId: serverId,
    Username: username,
    Timestamp: new Date().toISOString(),
  }
}

export function buildListRequest({ username }) {
  return {
    Username: username,
    Timestamp: new Date().toISOString(),
  }
}

export function buildDetailRequest({ flowId, userId }) {
  return {
    FlowId: flowId,
    UserId: userId,
    Timestamp: new Date().toISOString(),
  }
}
