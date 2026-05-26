#!/bin/bash

export ASPNETCORE_ENVIRONMENT=Development
export ConnectionStrings__PostgreSQL='Host=localhost;Port=5432;Database=dev;Username=postgres;Password=password;Include Error Detail=true'