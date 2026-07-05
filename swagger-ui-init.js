
window.onload = function() {
  // Build a system
  var url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  var options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "info": {
      "version": "1.0.0",
      "title": "API Contract SIMS PPOB",
      "description": "Documentation for Take Home Test API"
    },
    "servers": [
      {
        "url": "https://take-home-test-api.nutech-integrasi.com",
        "description": "Server Development"
      }
    ],
    "components": {
      "securitySchemes": {
        "bearerAuth": {
          "type": "http",
          "scheme": "bearer",
          "bearerFormat": "JWT"
        }
      },
      "schemas": null
    },
    "paths": {
      "/registration": {
        "post": {
          "description": "**API Registration Public (Tidak perlu Token untuk mengaksesnya)**\n\nDigunakan untuk melakukan registrasi User agar bisa Login kedalam aplikasi\n\n*Ketentuan :*\n1. Parameter request __email__ harus terdapat validasi format email\n2. Parameter request __password__ Length minimal 8 karakter\n3. Handling Response sesuai dokumentasi Response dibawah\n",
          "tags": [
            "1. Module Membership"
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "email",
                    "first_name",
                    "last_name",
                    "password"
                  ],
                  "properties": {
                    "email": {
                      "type": "string",
                      "description": "Email dari User"
                    },
                    "first_name": {
                      "type": "string",
                      "description": "First Name dari User"
                    },
                    "last_name": {
                      "type": "string",
                      "description": "Last Name dari User"
                    },
                    "password": {
                      "type": "string",
                      "description": "Password dari User"
                    }
                  },
                  "example": {
                    "email": "user@nutech-integrasi.com",
                    "first_name": "User",
                    "last_name": "Nutech",
                    "password": "abcdef1234"
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Request Successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "integer",
                        "description": "Internal Status Code"
                      },
                      "message": {
                        "type": "string",
                        "description": "Description for Internal Status Code"
                      },
                      "data": {
                        "type": "object",
                        "description": "No Response (Null)"
                      }
                    },
                    "example": {
                      "status": 0,
                      "message": "Registrasi berhasil silahkan login",
                      "data": null
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "integer",
                        "description": "Internal Status Code"
                      },
                      "message": {
                        "type": "string",
                        "description": "Description for Internal Status Code"
                      },
                      "data": {
                        "type": null,
                        "description": "No data returned"
                      }
                    },
                    "example": {
                      "status": 102,
                      "message": "Paramter email tidak sesuai format",
                      "data": null
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/login": {
        "post": {
          "description": "**API Login Public (Tidak perlu Token untuk mengaksesnya)**\n\nDigunakan untuk melakukan login dan mendapatkan authentication berupa JWT (Json Web Token)\n\n*Ketentuan :*\n1. Parameter request __email__ harus terdapat validasi format email\n2. Parameter request __password__ Length minimal 8 karakter\n3. __JWT__ yang digenerate harus memuat payload __email__ dan di set __expiration__ selama 12 jam dari waktu di generate\n4. Handling Response sesuai dokumentasi Response dibawah\n",
          "tags": [
            "1. Module Membership"
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "email",
                    "password"
                  ],
                  "properties": {
                    "email": {
                      "type": "string",
                      "description": "Email User yang telah diregistrasi"
                    },
                    "password": {
                      "type": "string",
                      "description": "Password User yang telah diregistrasi"
                    }
                  },
                  "example": {
                    "email": "user@nutech-integrasi.com",
                    "password": "abcdef1234"
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Berhasil Login",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "integer",
                        "description": "Internal Status Code"
                      },
                      "message": {
                        "type": "string",
                        "description": "Description for Internal Status Code"
                      },
                      "data": {
                        "type": "object",
                        "description": "No Response (Null)"
                      }
                    },
                    "example": {
                      "status": 0,
                      "message": "Login Sukses",
                      "data": {
                        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiNTRVdXRjYTdCS0ZPX0ZUZGZ1bXlJem9zSTRKa1VxUGZVZ0ROSTUwelRTQlo2aHoyY0hKZ1VMb1loM09HUUd0ekQxV3dTX194aHBNZTE2SGFscVRzcEhjS21UclJ3S2FYYmZob3AzdzFFUHJ2NFdBQmk1c0RpdV9DSnZTSWt2MDFTbEU0QU5pbVB0bUx5azZoUzlOalVQNEZaVVpfRVBtcEk4Y3pNc3ZWa2JFPSIsImlhdCI6MTYyNjkyODk3MSwiZXhwIjoyNTU2MTE4Nzk4fQ.9C9NvhZYKivhGWnrjo4Wr1Rv-wur1wCm0jqfK9XDD8U"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "integer",
                        "description": "Internal Status Code"
                      },
                      "message": {
                        "type": "string",
                        "description": "Description for Internal Status Code"
                      },
                      "data": {
                        "type": null,
                        "description": "No data returned"
                      }
                    },
                    "example": {
                      "status": 102,
                      "message": "Paramter email tidak sesuai format",
                      "data": null
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "integer",
                        "description": "Internal Status Code"
                      },
                      "message": {
                        "type": "string",
                        "description": "Description for Internal Status Code"
                      },
                      "data": {
                        "type": null,
                        "description": "No data returned"
                      }
                    },
                    "example": {
                      "status": 103,
                      "message": "Username atau password salah",
                      "data": null
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/profile": {
        "get": {
          "description": "**API Profile Private (memerlukan Token untuk mengaksesnya)**\n\nDigunakan untuk mendapatkan informasi profile User\n\n*Ketentuan :*\n1. Service ini harus menggunakan __Bearer__ __Token__ __JWT__ untuk mengaksesnya\n2. Tidak ada parameter email di query param url ataupun request body, parameter email diambil dari payload JWT yang didapatkan dari hasil login\n3. Handling Response sesuai dokumentasi Response dibawah\n",
          "tags": [
            "1. Module Membership"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "Request Successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "integer",
                        "description": "Internal Status Code"
                      },
                      "message": {
                        "type": "string",
                        "description": "Description for Internal Status Code"
                      },
                      "data": {
                        "type": "object",
                        "description": "Contains information about list my cart"
                      }
                    },
                    "example": {
                      "status": 0,
                      "message": "Sukses",
                      "data": {
                        "email": "user@nutech-integrasi.com",
                        "first_name": "User",
                        "last_name": "Nutech",
                        "profile_image": "https://yoururlapi.com/profile.jpeg"
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "integer",
                        "description": "Internal Status Code"
                      },
                      "message": {
                        "type": "string",
                        "description": "Description for Internal Status Code"
                      },
                      "data": {
                        "type": null,
                        "description": "No data returned"
                      }
                    },
                    "example": {
                      "status": 108,
                      "message": "Token tidak tidak valid atau kadaluwarsa",
                      "data": null
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/profile/update": {
        "put": {
          "description": "**API Update Profile Private (memerlukan Token untuk mengaksesnya)**\n\nDigunakan untuk mengupdate data profile User\n\n*Ketentuan :*\n1. Service ini harus menggunakan __Bearer__ __Token__ __JWT__ untuk mengaksesnya\n2. Tidak ada parameter email di query param url ataupun request body, parameter email diambil dari payload JWT yang didapatkan dari hasil login\n3. Handling Response sesuai dokumentasi Response dibawah\n",
          "tags": [
            "1. Module Membership"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "first_name",
                    "last_name"
                  ],
                  "properties": {
                    "first_name": {
                      "type": "string",
                      "description": "First Name dari User"
                    },
                    "last_name": {
                      "type": "string",
                      "description": "Last Name dari User"
                    }
                  },
                  "example": {
                    "first_name": "User Edited",
                    "last_name": "Nutech Edited"
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Request Successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "integer",
                        "description": "Internal Status Code"
                      },
                      "message": {
                        "type": "string",
                        "description": "Description for Internal Status Code"
                      },
                      "data": {
                        "type": "object",
                        "description": "No Response (Null)"
                      }
                    },
                    "example": {
                      "status": 0,
                      "message": "Update Pofile berhasil",
                      "data": {
                        "email": "user@nutech-integrasi.com",
                        "first_name": "User Edited",
                        "last_name": "Nutech Edited",
                        "profile_image": "https://yoururlapi.com/profile.jpeg"
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "integer",
                        "description": "Internal Status Code"
                      },
                      "message": {
                        "type": "string",
                        "description": "Description for Internal Status Code"
                      },
                      "data": {
                        "type": null,
                        "description": "No data returned"
                      }
                    },
                    "example": {
                      "status": 108,
                      "message": "Token tidak tidak valid atau kadaluwarsa",
                      "data": null
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/profile/image": {
        "put": {
          "description": "**API Upload Profile Image Private (memerlukan Token untuk mengaksesnya)**\n\nDigunakan untuk mengupdate / upload profile image User\n\n*Ketentuan :*\n1. Service ini harus menggunakan __Bearer__ __Token__ __JWT__ untuk mengaksesnya\n2. Tidak ada parameter email di query param url ataupun request body, parameter email diambil dari payload JWT yang didapatkan dari hasil login\n3. Format Image yang boleh di upload hanya __jpeg__ dan __png__\n4. Handling Response sesuai dokumentasi Response dibawah\n",
          "tags": [
            "1. Module Membership"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "file": {
                      "type": "string",
                      "format": "binary"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Request Successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "integer",
                        "description": "Internal Status Code"
                      },
                      "message": {
                        "type": "string",
                        "description": "Description for Internal Status Code"
                      },
                      "data": {
                        "type": "object",
                        "description": "No Response (Null)"
                      }
                    },
                    "example": {
                      "status": 0,
                      "message": "Update Profile Image berhasil",
                      "data": {
                        "email": "user@nutech-integrasi.com",
                        "first_name": "User Edited",
                        "last_name": "Nutech Edited",
                        "profile_image": "https://yoururlapi.com/profile-updated.jpeg"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "integer",
                        "description": "Internal Status Code"
                      },
                      "message": {
                        "type": "string",
                        "description": "Description for Internal Status Code"
                      },
                      "data": {
                        "type": null,
                        "description": "No data returned"
                      }
                    },
                    "example": {
                      "status": 102,
                      "message": "Format Image tidak sesuai",
                      "data": null
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "integer",
                        "description": "Internal Status Code"
                      },
                      "message": {
                        "type": "string",
                        "description": "Description for Internal Status Code"
                      },
                      "data": {
                        "type": null,
                        "description": "No data returned"
                      }
                    },
                    "example": {
                      "status": 108,
                      "message": "Token tidak tidak valid atau kadaluwarsa",
                      "data": null
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/banner": {
        "get": {
          "description": "**API Banner Public (tidak memerlukan Token untuk mengaksesnya)**\n\nDigunakan untuk mendapatkan list banner\n\n*Ketentuan :*\n1. Buat data list banner sesuai dokumentasi Response dibawah, usahakan banner ini tidak di hardcode, melainkan ambil dari database \n2. Tidak perlu membuatkan module CRUD banner\n3. Handling Response sesuai dokumentasi Response dibawah\n",
          "tags": [
            "2. Module Information"
          ],
          "responses": {
            "200": {
              "description": "Request Successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "integer",
                        "description": "Internal Status Code"
                      },
                      "message": {
                        "type": "string",
                        "description": "Description for Internal Status Code"
                      },
                      "data": {
                        "type": "object",
                        "description": "Berisi list banner"
                      }
                    },
                    "example": {
                      "status": 0,
                      "message": "Sukses",
                      "data": [
                        {
                          "banner_name": "Banner 1",
                          "banner_image": "https://nutech-integrasi.app/dummy.jpg",
                          "description": "Lerem Ipsum Dolor sit amet"
                        },
                        {
                          "banner_name": "Banner 2",
                          "banner_image": "https://nutech-integrasi.app/dummy.jpg",
                          "description": "Lerem Ipsum Dolor sit amet"
                        },
                        {
                          "banner_name": "Banner 3",
                          "banner_image": "https://nutech-integrasi.app/dummy.jpg",
                          "description": "Lerem Ipsum Dolor sit amet"
                        },
                        {
                          "banner_name": "Banner 4",
                          "banner_image": "https://nutech-integrasi.app/dummy.jpg",
                          "description": "Lerem Ipsum Dolor sit amet"
                        },
                        {
                          "banner_name": "Banner 5",
                          "banner_image": "https://nutech-integrasi.app/dummy.jpg",
                          "description": "Lerem Ipsum Dolor sit amet"
                        },
                        {
                          "banner_name": "Banner 6",
                          "banner_image": "https://nutech-integrasi.app/dummy.jpg",
                          "description": "Lerem Ipsum Dolor sit amet"
                        }
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/services": {
        "get": {
          "description": "**API Services Private (memerlukan Token untuk mengaksesnya)**\n\nDigunakan untuk mendapatkan list Service/Layanan PPOB\n\n*Ketentuan :*\n1. Buat data list Service/Layanan sesuai dokumentasi Response dibawah, usahakan data list __Service__ atau __Layanan__ ini tidak di hardcode, melainkan ambil dari database \n2. Tidak perlu membuatkan module CRUD Service/Layanan\n3. Handling Response sesuai dokumentasi Response dibawah\n",
          "tags": [
            "2. Module Information"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "Request Successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "integer",
                        "description": "Internal Status Code"
                      },
                      "message": {
                        "type": "string",
                        "description": "Description for Internal Status Code"
                      },
                      "data": {
                        "type": "object",
                        "description": "Contains information about list my cart"
                      }
                    },
                    "example": {
                      "status": 0,
                      "message": "Sukses",
                      "data": [
                        {
                          "service_code": "PAJAK",
                          "service_name": "Pajak PBB",
                          "service_icon": "https://nutech-integrasi.app/dummy.jpg",
                          "service_tariff": 40000
                        },
                        {
                          "service_code": "PLN",
                          "service_name": "Listrik",
                          "service_icon": "https://nutech-integrasi.app/dummy.jpg",
                          "service_tariff": 10000
                        },
                        {
                          "service_code": "PDAM",
                          "service_name": "PDAM Berlangganan",
                          "service_icon": "https://nutech-integrasi.app/dummy.jpg",
                          "service_tariff": 40000
                        },
                        {
                          "service_code": "PULSA",
                          "service_name": "Pulsa",
                          "service_icon": "https://nutech-integrasi.app/dummy.jpg",
                          "service_tariff": 40000
                        },
                        {
                          "service_code": "PGN",
                          "service_name": "PGN Berlangganan",
                          "service_icon": "https://nutech-integrasi.app/dummy.jpg",
                          "service_tariff": 50000
                        },
                        {
                          "service_code": "MUSIK",
                          "service_name": "Musik Berlangganan",
                          "service_icon": "https://nutech-integrasi.app/dummy.jpg",
                          "service_tariff": 50000
                        },
                        {
                          "service_code": "TV",
                          "service_name": "TV Berlangganan",
                          "service_icon": "https://nutech-integrasi.app/dummy.jpg",
                          "service_tariff": 50000
                        },
                        {
                          "service_code": "PAKET_DATA",
                          "service_name": "Paket data",
                          "service_icon": "https://nutech-integrasi.app/dummy.jpg",
                          "service_tariff": 50000
                        },
                        {
                          "service_code": "VOUCHER_GAME",
                          "service_name": "Voucher Game",
                          "service_icon": "https://nutech-integrasi.app/dummy.jpg",
                          "service_tariff": 100000
                        },
                        {
                          "service_code": "VOUCHER_MAKANAN",
                          "service_name": "Voucher Makanan",
                          "service_icon": "https://nutech-integrasi.app/dummy.jpg",
                          "service_tariff": 100000
                        },
                        {
                          "service_code": "QURBAN",
                          "service_name": "Qurban",
                          "service_icon": "https://nutech-integrasi.app/dummy.jpg",
                          "service_tariff": 200000
                        },
                        {
                          "service_code": "ZAKAT",
                          "service_name": "Zakat",
                          "service_icon": "https://nutech-integrasi.app/dummy.jpg",
                          "service_tariff": 300000
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "integer",
                        "description": "Internal Status Code"
                      },
                      "message": {
                        "type": "string",
                        "description": "Description for Internal Status Code"
                      },
                      "data": {
                        "type": null,
                        "description": "No data returned"
                      }
                    },
                    "example": {
                      "status": 108,
                      "message": "Token tidak tidak valid atau kadaluwarsa",
                      "data": null
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/balance": {
        "get": {
          "description": "**API Balance Private (memerlukan Token untuk mengaksesnya)**\n\nDigunakan untuk mendapatkan informasi balance / saldo terakhir dari User\n\n*Ketentuan :*\n1. Service ini harus menggunakan __Bearer__ __Token__ __JWT__ untuk mengaksesnya\n2. Tidak ada parameter email di query param url ataupun request body, parameter email diambil dari payload JWT yang didapatkan dari hasil login\n3. Handling Response sesuai dokumentasi Response dibawah\n",
          "tags": [
            "3. Module Transaction"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "Get Balance / Saldo Berhasil",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "integer",
                        "description": "Status Code Berhasil Get Balance"
                      },
                      "message": {
                        "type": "string",
                        "description": "Deskripsi berhasil Get Balance"
                      },
                      "data": {
                        "type": "object",
                        "description": "Berisi informasi Balance User"
                      }
                    },
                    "example": {
                      "status": 0,
                      "message": "Get Balance Berhasil",
                      "data": {
                        "balance": 1000000
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "integer",
                        "description": "Status Code Jika Token Expired / Invalid"
                      },
                      "message": {
                        "type": "string",
                        "description": "Deskripsi jika Token Expired / Invalid"
                      },
                      "data": {
                        "type": null,
                        "description": "Data Null"
                      }
                    },
                    "example": {
                      "status": 108,
                      "message": "Token tidak tidak valid atau kadaluwarsa",
                      "data": null
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/topup": {
        "post": {
          "description": "**API Topup Private (memerlukan Token untuk mengaksesnya)**\n\nDigunakan untuk melakukan top up balance / saldo dari User\n\n*Ketentuan :*\n1. Service ini harus menggunakan __Bearer__ __Token__ __JWT__ untuk mengaksesnya\n2. Tidak ada parameter email di query param url ataupun request body, parameter email diambil dari payload JWT yang didapatkan dari hasil login\n3. Setiap kali melakukan Top Up maka balance / saldo dari User otomatis bertambah\n4. Parameter __amount__ hanya boleh angka saja dan tidak boleh lebih kecil dari 0\n5. Pada saat Top Up set transaction_type di database menjadi __TOPUP__\n6. Handling Response sesuai dokumentasi Response dibawah\n",
          "tags": [
            "3. Module Transaction"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "amount"
                  ],
                  "properties": {
                    "top_up_amount": {
                      "type": "integer",
                      "description": "Top Up Amount untuk update balance"
                    }
                  },
                  "example": {
                    "top_up_amount": 1000000
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Request Successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "integer",
                        "description": "Internal Status Code"
                      },
                      "message": {
                        "type": "string",
                        "description": "Description for Internal Status Code"
                      },
                      "data": {
                        "type": "object",
                        "description": "No Response (Null)"
                      }
                    },
                    "example": {
                      "status": 0,
                      "message": "Top Up Balance berhasil",
                      "data": {
                        "balance": 2000000
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "integer",
                        "description": "Internal Status Code"
                      },
                      "message": {
                        "type": "string",
                        "description": "Description for Internal Status Code"
                      },
                      "data": {
                        "type": null,
                        "description": "No data returned"
                      }
                    },
                    "example": {
                      "status": 102,
                      "message": "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
                      "data": null
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "integer",
                        "description": "Status Code Jika Token Expired / Invalid"
                      },
                      "message": {
                        "type": "string",
                        "description": "Deskripsi jika Token Expired / Invalid"
                      },
                      "data": {
                        "type": null,
                        "description": "Data Null"
                      }
                    },
                    "example": {
                      "status": 108,
                      "message": "Token tidak tidak valid atau kadaluwarsa",
                      "data": null
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/transaction": {
        "post": {
          "description": "**API Transaction Private (memerlukan Token untuk mengaksesnya)**\n\nDigunakan untuk melakukan transaksi dari services / layanan yang tersedia\n\n*Ketentuan :*\n1. Service ini harus menggunakan __Bearer__ __Token__ __JWT__ untuk mengaksesnya\n2. Tidak ada parameter email di query param url ataupun request body, parameter email diambil dari payload JWT yang didapatkan dari hasil login\n3. Setiap kali melakukan Transaksi harus dipastikan balance / saldo mencukupi\n4. Pada saat Transaction set transaction_type di database menjadi __PAYMENT__\n5. Handling Response sesuai dokumentasi Response dibawah\n6. Response __invoice_number__ untuk formatnya generate bebas\n",
          "tags": [
            "3. Module Transaction"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "service_code"
                  ],
                  "properties": {
                    "service_code": {
                      "type": "string",
                      "description": "Service Code yang didapatkan dari API Services"
                    }
                  },
                  "example": {
                    "service_code": "PULSA"
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Transaksi Berhasil",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "integer",
                        "description": "Internal Status Code"
                      },
                      "message": {
                        "type": "string",
                        "description": "Description for Internal Status Code"
                      },
                      "data": {
                        "type": "object",
                        "description": "No Response (Null)"
                      }
                    },
                    "example": {
                      "status": 0,
                      "message": "Transaksi berhasil",
                      "data": {
                        "invoice_number": "INV17082023-001",
                        "service_code": "PLN_PRABAYAR",
                        "service_name": "PLN Prabayar",
                        "transaction_type": "PAYMENT",
                        "total_amount": 10000,
                        "created_on": "2023-08-17T10:10:10.000Z"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "integer",
                        "description": "Internal Status Code"
                      },
                      "message": {
                        "type": "string",
                        "description": "Description for Internal Status Code"
                      },
                      "data": {
                        "type": null,
                        "description": "No data returned"
                      }
                    },
                    "example": {
                      "status": 102,
                      "message": "Service ataus Layanan tidak ditemukan",
                      "data": null
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "integer",
                        "description": "Status Code Jika Token Expired / Invalid"
                      },
                      "message": {
                        "type": "string",
                        "description": "Deskripsi jika Token Expired / Invalid"
                      },
                      "data": {
                        "type": null,
                        "description": "Data Null"
                      }
                    },
                    "example": {
                      "status": 108,
                      "message": "Token tidak tidak valid atau kadaluwarsa",
                      "data": null
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/transaction/history": {
        "get": {
          "description": "**API History Private (memerlukan Token untuk mengaksesnya)**\n\nDigunakan untuk mendapatkan informasi history transaksi\n\n*Ketentuan :*\n1. Service ini harus menggunakan __Bearer__ __Token__ __JWT__ untuk mengaksesnya\n2. Tidak ada parameter email di query param url ataupun request body, parameter email diambil dari payload JWT yang didapatkan dari hasil login\n3. Terdapat parameter __limit__ yang bersifat __opsional__, jika limit tidak dikirim maka tampilkan semua data\n4. Data di order dari yang paling baru berdasarkan transaction date (created_on)\n5. Handling Response sesuai dokumentasi Response dibawah\n",
          "tags": [
            "3. Module Transaction"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "name": "offset",
              "in": "query",
              "schema": {
                "type": "integer",
                "description": "Number of offset",
                "example": 0
              }
            },
            {
              "name": "limit",
              "in": "query",
              "schema": {
                "type": "integer",
                "description": "Limit Data History Transaksi",
                "example": 3
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Get History Transaksi berhasil",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "integer",
                        "description": "Status Code Berhasil Get Balance"
                      },
                      "message": {
                        "type": "string",
                        "description": "Deskripsi berhasil Get Balance"
                      },
                      "data": {
                        "type": "object",
                        "description": "Berisi informasi Balance User"
                      }
                    },
                    "example": {
                      "status": 0,
                      "message": "Get History Berhasil",
                      "data": {
                        "offset": 0,
                        "limit": 3,
                        "records": [
                          {
                            "invoice_number": "INV17082023-001",
                            "transaction_type": "TOPUP",
                            "description": "Top Up balance",
                            "total_amount": 100000,
                            "created_on": "2023-08-17T10:10:10.000Z"
                          },
                          {
                            "invoice_number": "INV17082023-002",
                            "transaction_type": "PAYMENT",
                            "description": "PLN Pascabayar",
                            "total_amount": 10000,
                            "created_on": "2023-08-17T11:10:10.000Z"
                          },
                          {
                            "invoice_number": "INV17082023-003",
                            "transaction_type": "PAYMENT",
                            "description": "Pulsa Indosat",
                            "total_amount": 40000,
                            "created_on": "2023-08-17T12:10:10.000Z"
                          }
                        ]
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "integer",
                        "description": "Status Code Jika Token Expired / Invalid"
                      },
                      "message": {
                        "type": "string",
                        "description": "Deskripsi jika Token Expired / Invalid"
                      },
                      "data": {
                        "type": null,
                        "description": "Data Null"
                      }
                    },
                    "example": {
                      "status": 108,
                      "message": "Token tidak tidak valid atau kadaluwarsa",
                      "data": null
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "customOptions": {},
  "swaggerUrl": {}
};
  url = options.swaggerUrl || url
  var urls = options.swaggerUrls
  var customOptions = options.customOptions
  var spec1 = options.swaggerDoc
  var swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (var attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  var ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.oauth) {
    ui.initOAuth(customOptions.oauth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }

  window.ui = ui
}
