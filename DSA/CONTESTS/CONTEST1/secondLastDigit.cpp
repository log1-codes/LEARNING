#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    n = abs(n);  
    int secondDigit = (n / 10) % 10;

    cout << secondDigit;
    return 0;
}
