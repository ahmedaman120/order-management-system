// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.181.1
//   protoc               v5.27.2
// source: libs/grpc/src/proto/auth.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "auth";

export interface ValidateTokenRequestRPCDto {
  token: string;
}

export interface DecodedUserResponseRPCDto {
  userId: string;
  email: string;
}

export interface ValidateTokenResponseRPCDto {
  user?: DecodedUserResponseRPCDto | undefined;
  empty?: Empty | undefined;
}

export interface Empty {
}

export const AUTH_PACKAGE_NAME = "auth";

export interface RpcAuthServiceClient {
  validateUserTokenRpc(request: ValidateTokenRequestRPCDto): Observable<ValidateTokenResponseRPCDto>;
}

export interface RpcAuthServiceController {
  validateUserTokenRpc(
    request: ValidateTokenRequestRPCDto,
  ): Promise<ValidateTokenResponseRPCDto> | Observable<ValidateTokenResponseRPCDto> | ValidateTokenResponseRPCDto;
}

export function RpcAuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["validateUserTokenRpc"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("RpcAuthService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("RpcAuthService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const RPC_AUTH_SERVICE_NAME = "RpcAuthService";
