#include <iostream>
#include <string>
using namespace std;

int main() {
    string N;
    cin >> N;

    for (int i = N.size() - 1; i >= 0; i--) {
        cout << N[i];
    }

    return 0;
}
